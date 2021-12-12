import { ActivityType, Channel, Client, ShardingManager, TextChannel, User as DiscordUser } from 'discord.js';
import { User, VerifyInfiniteFlightUserIDTicket } from '.prisma/client';

import { validateSync } from 'class-validator';
import { CustomClient } from '../extensions';
import * as infiniteFlightLive from '../lib/infinite-flight-live';
import { FlightEntry, InfiniteFlightSession, InfiniteFlightStatus } from '../lib/infinite-flight-live/types';
import { BotSite } from '../models/config-models';
import { LangCode } from '../models/enums';
import { HttpService, Lang, Logger, prismaClient } from '../services';
import { ClientUtils, MessageUtils, ShardUtils } from '../utils';
import { VerifyInfiniteFlightUserIDTicketUtils } from '../utils/verify-infinite-flight-user-id-ticket-utils';
import { Job } from './job';
import { ActivePilotUser } from './types';

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

        for (let activePilotUser of activePilotUsers) {
            const testChannel: TextChannel = (await this.client.channels.cache.get(
                Config.development.kennedySteveSpamChannelID) as TextChannel);

            const discordUser = await ClientUtils.getUser(this.client, activePilotUser.user.discordUserID);
            const aircraftName = AircraftNames[activePilotUser.flight.aircraftId];
            const liveryName = LiveryNames[activePilotUser.flight.liveryId];
            MessageUtils.send(
                testChannel,
                Lang.getEmbed(
                    'notificationEmbeds.activePilot',
                    LangCode.EN_US,
                    {
                        DISCORD_ID: discordUser.id,
                        DISCORD_USERNAME: discordUser.username,
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
        }
    }

    /**
     * TODO: fix smelly code
     * @returns a list of database users that are online as pilots
     */
    private async getActivePilotUsers(): Promise<ActivePilotUser[]> {
        const activePilotInfiniteFlightMap: Map<string, FlightEntry> = await this.getActivePilotInfiniteFlightMap()
        const flights: FlightEntry[] = Array.from(activePilotInfiniteFlightMap.values());
        const activePilotInfiniteFlightUserIDs: string[] = flights.map(flight => flight.userId);

        await this.verify(activePilotInfiniteFlightMap);

        const users: User[] = await prismaClient.user.findMany({
            where: {
                infiniteFlightUserID: {
                    in: activePilotInfiniteFlightUserIDs
                }
            }
        });

        const activePilotUsers: ActivePilotUser[] = new Array();
        for (let user of users) {
            const flight = activePilotInfiniteFlightMap.get(user.infiniteFlightUserID);
            const activePilotUser: ActivePilotUser = {
                user,
                flight
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

    private async verify(activePilotInfiniteFlightMap: Map<string, FlightEntry>): Promise<void> {
        const flights: FlightEntry[] = Array.from(activePilotInfiniteFlightMap.values());
        const activePilotInfiniteFlightUserIDs: string[] = flights.map(flight => flight.userId);

        const freshTicketsCutoffDateTime: Date = VerifyInfiniteFlightUserIDTicketUtils.getFreshTicketsCutoffDateTime();
        const verifyInfiniteFlightUserIDTickets: VerifyInfiniteFlightUserIDTicket[] = await prismaClient.verifyInfiniteFlightUserIDTicket.findMany({
            where: {
                infiniteFlightUserID: {
                    in: activePilotInfiniteFlightUserIDs
                },
                created: {
                    gt: freshTicketsCutoffDateTime
                },
                verified: false,
                rejected: false,
            }
        });

        for (let ticket of verifyInfiniteFlightUserIDTickets) {
            const flight: FlightEntry = activePilotInfiniteFlightMap.get(ticket.infiniteFlightUserID);
            const discordUser: DiscordUser = await ClientUtils.getUser(this.client, ticket.discordUserID);

            // TODO: fix potential bug, apprently this conditional doesn't work...
            if (flight !== null) {
                const flightPassesAllChecks: boolean = VerifyInfiniteFlightUserIDTicketUtils.checkIfFlightPassesAllChecks(
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
                                STALE_MINUTES: Config.modelConstants.verifyInfiniteFlightUserIDTicket.staleByMinutes,
                            }
                        )
                    )
                }
            }
        }
    }

    /**
     * Update User and VerifyInfiniteFlightUserIDTicket
     * @param discordUserID
     * @param ticketID
     * @param flight
     */
    private async updateModelsForVerifiedUser(discordUserID: string, ticketID: string, flight: FlightEntry): Promise<void> {

        // Now we finally register the Infinite Flight User ID
        await prismaClient.user.update({
            where: {
                discordUserID,
            },
            data: {
                infiniteFlightUserID: flight.userId,
            },
        });

        // Verified tickets are not deleted, they are updated to show they are verified
        // This helps for archival purposes and acts as our receipt.
        await prismaClient.verifyInfiniteFlightUserIDTicket.update({
            where: {
                id: ticketID,
            },
            data: {
                verified: true,
                verifiedByFlightEntryID: flight.flightId,
            },
        });
    }


    /**
     * This is a test method, will be deprecated and deleted eventually
     * @returns the channel the devs use for testing
     */
    private async getTestChannel(): Promise<TextChannel> {
        const testChannel: TextChannel = (await this.client.channels.cache.get(
            Config.development.kennedySteveSpamChannelID) as TextChannel);

        return testChannel;
    }

}
