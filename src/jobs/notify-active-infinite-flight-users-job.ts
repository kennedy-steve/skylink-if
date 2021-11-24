import { User, VerifyInfiniteFlightUserIDTicket } from '.prisma/client';
import { ActivityType, Channel, Client, ShardingManager, TextChannel } from 'discord.js';

import { CustomClient } from '../extensions';
import { FlightEntry, InfiniteFlightSession, InfiniteFlightStatus } from '../lib/infinite-flight-live/types';
import { BotSite } from '../models/config-models';
import { HttpService, Lang, Logger, prismaClient } from '../services';
import { ShardUtils } from '../utils';
import { Job } from './job';
import * as infiniteFlightLive from '../lib/infinite-flight-live';
import { ActivePilotUser } from './types';
import { VerifyInfiniteFlightUserIDTicketUtils } from '../utils/verify-infinite-flight-user-id-ticket-utils';
import { validateSync } from 'class-validator';

let Config = require('../../config/config.json');
let BotSites: BotSite[] = require('../../config/bot-sites.json');
let Logs = require('../../lang/logs.json');

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
                Config.development.kennedySteveSpamChannelID) as TextChannel);

            testChannel.send(`<@${activePilotUser.user.discordUserID}> is active on infinite flight!`);
            Logger.info(`<@${activePilotUser.user.discordUserID}> is active on infinite flight!`)
        }
    }

    /**
     * TODO: fix smelly code
     * @returns a list of database users that are online as pilots
     */
    private async getActivePilotUsers(): Promise<ActivePilotUser[]> {
        const activePilotInfiniteFlightMap: Map<string, FlightEntry> = await this.getActivePilotInfiniteFlightMap()
        const flights: Array<FlightEntry> = Array.from(activePilotInfiniteFlightMap.values());
        const activePilotInfiniteFlightUserIDs: Array<string> = flights.map(flight => flight.userId);

        await this.verify(activePilotInfiniteFlightMap);

        const users: User[] = await prismaClient.user.findMany({
            where: {
                infiniteFlightUserID: {
                    in: activePilotInfiniteFlightUserIDs
                }
            }
        });

        const activePilotUsers: ActivePilotUser[] = new Array();
        for (var user of users) {
            const flight = activePilotInfiniteFlightMap.get(user.infiniteFlightUserID);
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
                activePilotInfiniteFlightMap.set(flight.userId, flight);
            }
        }
        return activePilotInfiniteFlightMap;
    }

    private async verify(activePilotInfiniteFlightMap: Map<string, FlightEntry>): Promise<void> {
        const flights: Array<FlightEntry> = Array.from(activePilotInfiniteFlightMap.values());
        const activePilotInfiniteFlightUserIDs: Array<string> = flights.map(flight => flight.userId);

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

        for (var ticket of verifyInfiniteFlightUserIDTickets) {
            const flight: FlightEntry = activePilotInfiniteFlightMap.get(ticket.infiniteFlightUserID);
            const testChannel: TextChannel = await this.getTestChannel();

            // TODO: fix potential bug, apprently this conditional doesn't work...
            if (flight !== null) {
                const flightPassesAllChecks: boolean = VerifyInfiniteFlightUserIDTicketUtils.checkIfFlightPassesAllChecks(
                    flight,
                    ticket,
                );

                if (flightPassesAllChecks) {
                    testChannel.send(`Woot woot, you are now verified!`);
                }
                else {
                    testChannel.send(`We detect that you're on Infinite Flight, but something is off (we won't tell you for security reasons). Check your True Heading, aircraft, and livery`);
                }
            }
        }
    }



    private async getTestChannel(): Promise<TextChannel> {
        const testChannel: TextChannel = (await this.client.channels.cache.get(
            Config.development.kennedySteveSpamChannelID) as TextChannel);

        return testChannel;
    }

}
