import { ActivePilotNotificationsChannel, User, VerifyInfiniteFlightUserIdTicket } from '.prisma/client';
import { ActivityType, Channel, Client, Guild, GuildMember, Permissions, ShardingManager, TextChannel, User as DiscordUser } from 'discord.js';

import { CustomClient } from '../extensions';
import { FlightEntry, InfiniteFlightSession, InfiniteFlightStatus } from '../lib/infinite-flight-live/types';
import { BotSite } from '../models/config-models';
import { HttpService, Lang, Logger, prismaClient } from '../services';
import { ClientUtils, MessageUtils, ShardUtils } from '../utils';
import { Job } from './job';
import * as infiniteFlightLive from '../lib/infinite-flight-live';
import { ActivePilotUser } from './types';
import { VerifyInfiniteFlightUserIdTicketUtils } from '../utils/verify-infinite-flight-user-id-ticket-utils';
import { validateSync } from 'class-validator';
import { LangCode } from '../models/enums';

let Config = require('../../config/config.json');
let AircraftNames = require('../../infinite-flight-data/aircraft-names.json');
let LiveryNames = require('../../infinite-flight-data/livery-names.json');

export class NotifyActiveInfiniteFlightUsersJob implements Job {
    public name = 'Notify Active Infinite Flight Users';
    public schedule: string = Config.jobs.notifyActiveInfiniteFlightUsers.schedule
    public log: boolean = Config.jobs.notifyActiveInfiniteFlightUsers.log;

    private infiniteFlightStatus: InfiniteFlightStatus;
    private client: Client;

    /**
     * TODO: check smelly code... 
     * @param theClient 
     */
    constructor(
        private theClient: Client,
    ) {
        this.client = theClient;
    }

    public async run(): Promise<void> {
        this.infiniteFlightStatus = await infiniteFlightLive.getInfiniteFlightStatus();
        await this.notifyActivePilotsOnGuildChannels();

    }
    /**
     * Sends out the notification to subscribed guild channels
     * @returns void
     */
    private async notifyActivePilotsOnGuildChannels(): Promise<void> {
        const activePilotUsers: ActivePilotUser[] = await this.getActivePilotUsers();

        for (var activePilotUser of activePilotUsers) {
            const testChannel: TextChannel = (await this.client.channels.cache.get(
                Config.development.kennedySteveSpamChannelId) as TextChannel);

            const discordUser = await ClientUtils.getUser(this.client, activePilotUser.user.discordUserId);

            // Check if user is in any notifications channels
            const allActivePilotNotificationChannels: ActivePilotNotificationsChannel[] = await prismaClient.activePilotNotificationsChannel.findMany();

            for (var activePilotNotificationChannel of allActivePilotNotificationChannels) {

                // channel may no longer exist
                try {
                    const guild: Guild = await this.client.guilds.fetch(activePilotNotificationChannel.discordGuildId);
                    const guildMember: GuildMember = await ClientUtils.findMember(guild, activePilotUser.user.discordUserId);
                    const channel: TextChannel = await this.client.channels.fetch(activePilotNotificationChannel.discordChannelId) as TextChannel;

                    const userCanViewChannel: boolean = await this.checkIfUserCanViewChannel(guildMember, channel);
                    if (userCanViewChannel) {
                        await this.sendActivePilotNotification(activePilotUser, guildMember, channel);
                    }
                } catch (error) {
                    Logger.error(`Error looking if a notification needs to be sent in a channel for a user. Discord User ID ${activePilotUser.user.discordUserId} | Channel ID: ${activePilotNotificationChannel.discordChannelId} | Guild ID: ${activePilotNotificationChannel.discordGuildId}`, error);
                }
            }

        }
    }


    /**
     * Set user as active pilot
     * @param guildMember 
     * @returns void
     */


    /**
     * Sends active pilot notification to a channel
     * @param activePilotUser
     * @param discordUser 
     * @param channel 
     * @returns void
     */
    private async sendActivePilotNotification(activePilotUser: ActivePilotUser, guildMember: GuildMember, channel: TextChannel): Promise<void> {
        // we may no longer have permissions to the channel
        const aircraftName = AircraftNames[activePilotUser.flight.aircraftId];
        const liveryName = LiveryNames[activePilotUser.flight.liveryId];

        try {
            MessageUtils.send(
                channel,
                Lang.getEmbed(
                    'notificationEmbeds.activePilot',
                    LangCode.EN_US,
                    {
                        DISCORD_ID: guildMember.id,
                        GUILD_DISPLAY_NAME: guildMember.displayName,
                        IFC_USERNAME: activePilotUser.flight.username,
                        SERVER_NAME: activePilotUser.flight.sessionInfo.name,
                        AIRCRAFT_NAME: aircraftName,
                        LIVERY_NAME: liveryName,
                        HEADING: activePilotUser.flight.heading.toString(),
                        LATITUDE: activePilotUser.flight.latitude.toString(),
                        LONGITUDE: activePilotUser.flight.longitude.toString(),
                    }

                )
            )
        } catch (error) {
            Logger.error(`Error sending active pilot notification. Discord User ID ${activePilotUser.user.discordUserId}`, error);
        }
    }


    /**
     * 
     * @param user 
     * @param channel 
     * @returns if user can view channel
     */
    private async checkIfUserCanViewChannel(guildMember: GuildMember, channel: TextChannel): Promise<boolean> {
        return (channel.permissionsFor(guildMember).has(Permissions.FLAGS.VIEW_CHANNEL));
    }

    /**
     * TODO: fix smelly code
     * @returns a list of database users that are online as pilots
     */
    private async getActivePilotUsers(): Promise<ActivePilotUser[]> {
        const activePilotInfiniteFlightMap: Map<string, FlightEntry> = await this.getActivePilotInfiniteFlightMap()
        const flights: Array<FlightEntry> = Array.from(activePilotInfiniteFlightMap.values());
        const activePilotInfiniteFlightUserIds: Array<string> = flights.map(flight => flight.userId);

        await this.verify(activePilotInfiniteFlightMap);

        const users: User[] = await prismaClient.user.findMany({
            where: {
                infiniteFlightUserId: {
                    in: activePilotInfiniteFlightUserIds
                }
            }
        });

        const activePilotUsers: ActivePilotUser[] = new Array();
        for (var user of users) {
            const flight = activePilotInfiniteFlightMap.get(user.infiniteFlightUserId);
            const activePilotUser: ActivePilotUser = {
                user: user,
                flight: flight
            };
            activePilotUsers.push(activePilotUser);
        }

        return activePilotUsers;
    }

    /**
     * @returns a list of Infinite Flight User IDs of Active Pilots
     */
    private async getActivePilotInfiniteFlightMap(): Promise<Map<string, FlightEntry>> {
        const activePilotInfiniteFlightMap: Map<string, FlightEntry> = new Map();

        for (var session of this.infiniteFlightStatus.sessions) {
            for (var flight of session.flights) {

                // attach session info to the flight
                // This will help with data processing later 😉
                flight.sessionInfo = session.sessionInfo;
                activePilotInfiniteFlightMap.set(flight.userId, flight);
            }
        }
        return activePilotInfiniteFlightMap;
    }

    private async verify(activePilotInfiniteFlightMap: Map<string, FlightEntry>): Promise<void> {
        const flights: Array<FlightEntry> = Array.from(activePilotInfiniteFlightMap.values());
        const activePilotInfiniteFlightUserIds: Array<string> = flights.map(flight => flight.userId);

        const freshTicketsCutoffDateTime: Date = VerifyInfiniteFlightUserIdTicketUtils.getFreshTicketsCutoffDateTime();
        const verifyInfiniteFlightUserIdTickets: VerifyInfiniteFlightUserIdTicket[] = await prismaClient.verifyInfiniteFlightUserIdTicket.findMany({
            where: {
                infiniteFlightUserId: {
                    in: activePilotInfiniteFlightUserIds
                },
                created: {
                    gt: freshTicketsCutoffDateTime
                },
                verified: false,
                rejected: false,
            }
        });

        for (var ticket of verifyInfiniteFlightUserIdTickets) {
            const flight: FlightEntry = activePilotInfiniteFlightMap.get(ticket.infiniteFlightUserId);
            const discordUser: DiscordUser = await ClientUtils.getUser(this.client, ticket.discordUserId);

            // TODO: fix potential bug, apprently this conditional doesn't work...
            if (flight !== null) {
                const flightPassesAllChecks: boolean = VerifyInfiniteFlightUserIdTicketUtils.checkIfFlightPassesAllChecks(
                    flight,
                    ticket,
                );

                if (flightPassesAllChecks) {
                    await this.updateModelsForVerifiedUser(discordUser.id, ticket.id, flight);
                    MessageUtils.send(
                        discordUser,
                        Lang.getEmbed(
                            'registerMeEmbeds.verified',
                            LangCode.EN_US,
                            {
                                IFC_USERNAME: flight.username,
                            }
                        )
                    )
                }
                else {
                    MessageUtils.send(
                        discordUser,
                        Lang.getEmbed(
                            'registerMeEmbeds.unsuccessfullVerification',
                            LangCode.EN_US,
                            {
                                STALE_MINUTES: Config.modelConstants.verifyInfiniteFlightUserIdTicket.staleByMinutes,
                            }
                        )
                    )
                }
            }
        }
    }

    /**
     * Update User and VerifyInfiniteFlightUserIdTicket
     * @param discordUserId 
     * @param ticketId 
     * @param flight 
     */
    private async updateModelsForVerifiedUser(discordUserId: string, ticketId: string, flight: FlightEntry): Promise<void> {

        // Now we finally register the Infinite Flight User ID
        await prismaClient.user.update({
            where: {
                discordUserId: discordUserId,
            },
            data: {
                infiniteFlightUserId: flight.userId,
            },
        });

        // Verified tickets are not deleted, they are updated to show they are verified
        // This helps for archival purposes and acts as our receipt. 
        await prismaClient.verifyInfiniteFlightUserIdTicket.update({
            where: {
                id: ticketId,
            },
            data: {
                verified: true,
                verifiedByFlightEntryId: flight.flightId,
            },
        });
    }


    /**
     * This is a test method, will be deprecated and deleted eventually
     * @returns the channel the devs use for testing
     */
    private async getTestChannel(): Promise<TextChannel> {
        const testChannel: TextChannel = (await this.client.channels.cache.get(
            Config.development.kennedySteveSpamChannelId) as TextChannel);

        return testChannel;
    }

}
