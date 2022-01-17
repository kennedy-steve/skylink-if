import {
    ActivityType,
    Channel,
    Client,
    Guild,
    GuildMember,
    Permissions,
    ShardingManager,
    TextChannel,
    User as DiscordUser,
} from 'discord.js';
import {
    ActivePilotNotificationsChannel,
    Prisma,
    User,
    VerifyInfiniteFlightUserIdTicket,
} from '.prisma/client';

import { ActiveControllerNotificationsChannel } from '@prisma/client';
import { validateSync } from 'class-validator';
import { Config } from '../config';
import { CustomClient } from '../extensions';
import * as infiniteFlightLive from '../lib/infinite-flight-live';
import {
    AtcEntry,
    FlightEntry,
    FrequencyType,
    InfiniteFlightSession,
    InfiniteFlightStatus,
} from '../lib/infinite-flight-live/types';
import { BotSite } from '../models/config-models';
import { LangCode } from '../models/enums';
import { ActiveControllerUser, ActivePilotUser } from '../models/infinite-flight-user-models';
import { HttpService, Lang, Logger, prismaClient } from '../services';
import { ClientUtils, MessageUtils, ShardUtils } from '../utils';
import { VerifyInfiniteFlightUserIdTicketUtils } from '../utils/verify-infinite-flight-user-id-ticket-utils';
import { Job } from './job';

let AircraftNames = require('../../infinite-flight-data/aircraft-names.json');
let LiveryNames = require('../../infinite-flight-data/livery-names.json');

export class NotifyActiveInfiniteFlightUsersJob implements Job {
    public name = 'Notify Active Infinite Flight Users';
    public schedule: string = Config.jobs.notifyActiveInfiniteFlightUsers.SCHEDULE;
    public log: boolean = Config.jobs.notifyActiveInfiniteFlightUsers.LOG;

    private infiniteFlightStatus: InfiniteFlightStatus;
    private client: Client;

    /**
     * TODO: check smelly code...
     * @param theClient
     */
    constructor(private theClient: Client) {
        this.client = theClient;
    }

    public async run(): Promise<void> {
        this.infiniteFlightStatus = await infiniteFlightLive.getInfiniteFlightStatus();
        await this.notifyActivePilotsOnGuildChannels();
        await this.notifyActiveControllersOnGuildChannels();
    }
    /**
     * Sends out the notification to subscribed guild channels
     * @returns void
     */
    private async notifyActivePilotsOnGuildChannels(): Promise<void> {
        const activePilotUsers: ActivePilotUser[] = await this.getActivePilotUsers();

        for (let activePilotUser of activePilotUsers) {
            const discordUser = await ClientUtils.getUser(
                this.client,
                activePilotUser.user.discordUserId
            );

            // Check if user is in any notifications channels
            const allActivePilotNotificationChannels: ActivePilotNotificationsChannel[] =
                await prismaClient.activePilotNotificationsChannel.findMany();

            for (let activePilotNotificationChannel of allActivePilotNotificationChannels) {
                // channel may no longer exist
                try {
                    const guild: Guild = await this.client.guilds.fetch(
                        activePilotNotificationChannel.discordGuildId
                    );
                    const guildMember: GuildMember = await ClientUtils.findMember(
                        guild,
                        activePilotUser.user.discordUserId
                    );
                    const channel: TextChannel = (await this.client.channels.fetch(
                        activePilotNotificationChannel.discordChannelId
                    )) as TextChannel;

                    // check if user can view channel
                    const userCanViewChannel: boolean = await this.checkIfUserCanViewChannel(
                        guildMember,
                        channel
                    );
                    if (userCanViewChannel) {
                        // send notification
                        await this.sendActivePilotNotification(
                            activePilotUser,
                            guildMember,
                            channel
                        );

                        // set user as active pilot
                        // This will prevent duplicate notifications
                        await this.setUserAsActivePilot(activePilotUser.user.discordUserId);
                    }
                } catch (error) {
                    Logger.error(
                        `Error looking if a notification needs to be sent in a channel for a user. Discord User ID ${activePilotUser.user.discordUserId} | Channel ID: ${activePilotNotificationChannel.discordChannelId} | Guild ID: ${activePilotNotificationChannel.discordGuildId}`,
                        error
                    );
                }
            }
        }
    }

    /**
     * Sends out the notification to subscribed guild channels
     * @returns void
     */
    private async notifyActiveControllersOnGuildChannels(): Promise<void> {
        const activeControllerUsers: ActiveControllerUser[] = await this.getActiveControllerUsers();

        for (let activeControllerUser of activeControllerUsers) {
            const discordUser = await ClientUtils.getUser(
                this.client,
                activeControllerUser.user.discordUserId
            );

            // Check if user is in any notifications channels
            const allActiveControllerNotificationChannels: ActiveControllerNotificationsChannel[] =
                await prismaClient.activeControllerNotificationsChannel.findMany();

            for (let activeControllerNotificationChannel of allActiveControllerNotificationChannels) {
                // channel may no longer exist
                try {
                    const guild: Guild = await this.client.guilds.fetch(
                        activeControllerNotificationChannel.discordGuildId
                    );
                    const guildMember: GuildMember = await ClientUtils.findMember(
                        guild,
                        activeControllerUser.user.discordUserId
                    );
                    const channel: TextChannel = (await this.client.channels.fetch(
                        activeControllerNotificationChannel.discordChannelId
                    )) as TextChannel;

                    // check if user can view channel
                    const userCanViewChannel: boolean = await this.checkIfUserCanViewChannel(
                        guildMember,
                        channel
                    );
                    if (userCanViewChannel) {
                        // send notification
                        await this.sendActiveControllerNotification(
                            activeControllerUser,
                            guildMember,
                            channel
                        );

                        // set user as active pilot
                        // This will prevent duplicate notifications
                        await this.setUserAsActiveController(
                            activeControllerUser.user.discordUserId
                        );
                    }
                } catch (error) {
                    Logger.error(
                        `Error looking if a notification needs to be sent in a channel for a user. Discord User ID ${activeControllerUser.user.discordUserId} | Channel ID: ${activeControllerNotificationChannel.discordChannelId} | Guild ID: ${activeControllerNotificationChannel.discordGuildId}`,
                        error
                    );
                }
            }
        }
    }

    /**
     * Set user as active pilot
     * @param discordUserId
     * @returns the updated user
     */
    private async setUserAsActivePilot(discordUserId: string): Promise<User> {
        const user: User = await prismaClient.user.update({
            where: {
                discordUserId,
            },
            data: {
                currentlyActiveAsPilot: true,
            },
        });
        return user;
    }

    /**
     * Set user as active controller
     * @param discordUserId
     * @returns the updated user
     */
    private async setUserAsActiveController(discordUserId: string): Promise<User> {
        const user: User = await prismaClient.user.update({
            where: {
                discordUserId,
            },
            data: {
                currentlyActiveAsController: true,
            },
        });
        return user;
    }

    /**
     * Sends active pilot notification to a channel
     * @param activePilotUser
     * @param discordUser
     * @param channel
     * @returns void
     */
    private async sendActivePilotNotification(
        activePilotUser: ActivePilotUser,
        guildMember: GuildMember,
        channel: TextChannel
    ): Promise<void> {
        // we may no longer have permissions to the channel
        const aircraftName = AircraftNames[activePilotUser.flight.aircraftId];
        const liveryName = LiveryNames[activePilotUser.flight.liveryId];

        try {
            MessageUtils.send(
                channel,
                Lang.getEmbed('notificationEmbeds.activePilot', LangCode.EN_US, {
                    DISCORD_ID: guildMember.id,
                    GUILD_DISPLAY_NAME: guildMember.displayName,
                    IFC_USERNAME: activePilotUser.flight.username,
                    SERVER_NAME: activePilotUser.flight.sessionInfo.name,
                    AIRCRAFT_NAME: aircraftName,
                    LIVERY_NAME: liveryName,
                    HEADING: activePilotUser.flight.heading.toString(),
                    LATITUDE: activePilotUser.flight.latitude.toString(),
                    LONGITUDE: activePilotUser.flight.longitude.toString(),
                })
            );
        } catch (error) {
            Logger.error(
                `Error sending active pilot notification. Discord User ID ${activePilotUser.user.discordUserId}`,
                error
            );
        }
    }

    /**
     * Sends active controller notification to a channel
     * @param activeControllerUser
     * @param GuildMember
     * @param TextChannel
     * @returns void
     */
    private async sendActiveControllerNotification(
        activeControllerUser: ActiveControllerUser,
        guildMember: GuildMember,
        channel: TextChannel
    ): Promise<void> {
        // we may no longer have permissions to the channel

        try {
            MessageUtils.send(
                channel,
                Lang.getEmbed('notificationEmbeds.activeController', LangCode.EN_US, {
                    DISCORD_ID: guildMember.id,
                    GUILD_DISPLAY_NAME: guildMember.displayName,
                    IFC_USERNAME: activeControllerUser.atcFacility.username,
                    SERVER_NAME: activeControllerUser.atcFacility.sessionInfo.name,
                    AIRPORT_NAME: activeControllerUser.atcFacility.airportName,
                    FREQUENCY_TYPE: FrequencyType[activeControllerUser.atcFacility.type],
                })
            );
        } catch (error) {
            Logger.error(
                `Error sending active controller notification. Discord User ID ${activeControllerUser.user.discordUserId}`,
                error
            );
        }
    }

    /**
     *
     * @param user
     * @param channel
     * @returns if user can view channel
     */
    private async checkIfUserCanViewChannel(
        guildMember: GuildMember,
        channel: TextChannel
    ): Promise<boolean> {
        return channel.permissionsFor(guildMember).has(Permissions.FLAGS.VIEW_CHANNEL);
    }

    /**
     * Gets active user and toggles active pilot status for inactive pilots.
     * @returns a list of database users that are online as pilots
     */
    private async getActivePilotUsers(): Promise<ActivePilotUser[]> {
        const activePilotInfiniteFlightMap: Map<string, FlightEntry> =
            await this.getActivePilotInfiniteFlightMap();
        const flights: FlightEntry[] = Array.from(activePilotInfiniteFlightMap.values());
        const activePilotInfiniteFlightUserIds: string[] = flights.map(flight => flight.userId);

        await this.verify(activePilotInfiniteFlightMap);

        const users: User[] = await prismaClient.user.findMany({
            where: {
                infiniteFlightUserId: {
                    in: activePilotInfiniteFlightUserIds,
                },
                currentlyActiveAsPilot: false,
            },
        });
        // toggle active users as inactive if not in active pilot list
        const inactiveUsersBatch: Prisma.BatchPayload = await prismaClient.user.updateMany({
            where: {
                infiniteFlightUserId: {
                    notIn: activePilotInfiniteFlightUserIds,
                },
                currentlyActiveAsPilot: true,
            },
            data: {
                currentlyActiveAsPilot: false,
            },
        });

        Logger.info(
            `Found ${users.length} new active pilots and ${inactiveUsersBatch.count} new inactive pilots.`
        );

        const activePilotUsers: ActivePilotUser[] = new Array();
        for (let user of users) {
            const flight = activePilotInfiniteFlightMap.get(user.infiniteFlightUserId);
            const activePilotUser: ActivePilotUser = {
                user,
                flight,
            };
            activePilotUsers.push(activePilotUser);
        }

        return activePilotUsers;
    }

    /**
     * Gets active user and toggles active pilot status for inactive pilots.
     * @returns a list of database users that are online as pilots
     */
    private async getActiveControllerUsers(): Promise<ActiveControllerUser[]> {
        const activeControllerInfiniteFlightMap: Map<string, AtcEntry> =
            await this.getActiveControllerInfiniteFlightMap();
        const atcFacilities: AtcEntry[] = Array.from(activeControllerInfiniteFlightMap.values());
        const activeControllerInfiniteFlightUserIds: string[] = atcFacilities.map(
            flight => flight.userId
        );

        const users: User[] = await prismaClient.user.findMany({
            where: {
                infiniteFlightUserId: {
                    in: activeControllerInfiniteFlightUserIds,
                },
                currentlyActiveAsController: false,
            },
        });
        // toggle active users as inactive if not in active pilot list
        const inactiveUsersBatch: Prisma.BatchPayload = await prismaClient.user.updateMany({
            where: {
                infiniteFlightUserId: {
                    notIn: activeControllerInfiniteFlightUserIds,
                },
                currentlyActiveAsController: true,
            },
            data: {
                currentlyActiveAsController: false,
            },
        });

        Logger.info(
            `Found ${users.length} new active controllers and ${inactiveUsersBatch.count} new inactive controllers.`
        );

        const activeControllerUsers: ActiveControllerUser[] = new Array();
        for (let user of users) {
            const flight = activeControllerInfiniteFlightMap.get(user.infiniteFlightUserId);
            const activeControllerUser: ActiveControllerUser = {
                user,
                atcFacility: flight,
                airport: null,
            };
            activeControllerUsers.push(activeControllerUser);
        }

        return activeControllerUsers;
    }

    /**
     * @returns a list of Infinite Flight User IDs of Active Pilots
     */
    private async getActivePilotInfiniteFlightMap(): Promise<Map<string, FlightEntry>> {
        const activePilotInfiniteFlightMap: Map<string, FlightEntry> = new Map();

        for (let session of this.infiniteFlightStatus.sessions) {
            for (let flight of session.flights) {
                // attach session info to the flight
                // This will help with data processing later 😉
                flight.sessionInfo = session.sessionInfo;
                activePilotInfiniteFlightMap.set(flight.userId, flight);
            }
        }
        return activePilotInfiniteFlightMap;
    }

    /**
     * @returns a list of Infinite Flight User IDs of Active Controllers
     */
    private async getActiveControllerInfiniteFlightMap(): Promise<Map<string, AtcEntry>> {
        const activeControllerInfiniteFlightMap: Map<string, AtcEntry> = new Map();

        for (let session of this.infiniteFlightStatus.sessions) {
            for (let airportStatus of session.airportStatuses) {
                for (let atc of airportStatus.atcFacilities) {
                    // attach session info to the flight
                    // This will help with data processing later 😉
                    atc.sessionInfo = session.sessionInfo;
                    activeControllerInfiniteFlightMap.set(atc.userId, atc);
                }
            }
        }
        return activeControllerInfiniteFlightMap;
    }

    // --- REGISTRATION VERIFICATION METHODS --- //

    /**
     * Verification of infinite flight user registration
     * @param activePilotInfiniteFlightMap
     */
    private async verify(activePilotInfiniteFlightMap: Map<string, FlightEntry>): Promise<void> {
        const flights: FlightEntry[] = Array.from(activePilotInfiniteFlightMap.values());
        const activePilotInfiniteFlightUserIds: string[] = flights.map(flight => flight.userId);

        const freshTicketsCutoffDateTime: Date =
            VerifyInfiniteFlightUserIdTicketUtils.getFreshTicketsCutoffDateTime();
        const verifyInfiniteFlightUserIdTickets: VerifyInfiniteFlightUserIdTicket[] =
            await prismaClient.verifyInfiniteFlightUserIdTicket.findMany({
                where: {
                    infiniteFlightUserId: {
                        in: activePilotInfiniteFlightUserIds,
                    },
                    created: {
                        gt: freshTicketsCutoffDateTime,
                    },
                    verified: false,
                    rejected: false,
                },
            });

        for (let ticket of verifyInfiniteFlightUserIdTickets) {
            const flight: FlightEntry = activePilotInfiniteFlightMap.get(
                ticket.infiniteFlightUserId
            );
            const discordUser: DiscordUser = await ClientUtils.getUser(
                this.client,
                ticket.discordUserId
            );

            // TODO: fix potential bug, apprently this conditional doesn't work...
            if (flight !== null) {
                const flightPassesAllChecks: boolean =
                    VerifyInfiniteFlightUserIdTicketUtils.checkIfFlightPassesAllChecks(
                        flight,
                        ticket
                    );

                if (flightPassesAllChecks) {
                    await this.updateModelsForVerifiedUser(discordUser.id, ticket.id, flight);
                    MessageUtils.send(
                        discordUser,
                        Lang.getEmbed('registerMeEmbeds.verified', LangCode.EN_US, {
                            IFC_USERNAME: flight.username,
                        })
                    );
                } else {
                    MessageUtils.send(
                        discordUser,
                        Lang.getEmbed(
                            'registerMeEmbeds.unsuccessfullVerification',
                            LangCode.EN_US,
                            {
                                STALE_MINUTES:
                                    Config.modelConstants.verifyInfiniteFlightUserIdTicket.STALE_BY_MINUTES.toString(),
                            }
                        )
                    );
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
    private async updateModelsForVerifiedUser(
        discordUserId: string,
        ticketId: string,
        flight: FlightEntry
    ): Promise<void> {
        // Now we finally register the Infinite Flight User ID
        await prismaClient.user.update({
            where: {
                discordUserId,
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
}
