import { User } from '.prisma/client';
import { ActivityType, Channel, Client, ShardingManager, TextChannel } from 'discord.js';

import { CustomClient } from '../extensions';
import { FlightEntry, InfiniteFlightSession, InfiniteFlightStatus } from '../lib/infinite-flight-live/types';
import { BotSite } from '../models/config-models';
import { HttpService, Lang, Logger, prismaClient } from '../services';
import { ShardUtils } from '../utils';
import { Job } from './job';
import * as infiniteFlightLive from '../lib/infinite-flight-live';

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
        const users: User[] = await this.getActivePilotUsers();

        for (var user of users) {
            const testChannel: TextChannel = (await this.client.channels.cache.get(
                Config.development.kennedySteveSpamChannelID) as TextChannel);

            testChannel.send(`<@${user.discordUserID}> is active on infinite flight!`);
            Logger.info(`<@${user.discordUserID}> is active on infinite flight!`)
        }
    }

    /**
     * 
     * @returns a list of database users that are online as pilots
     */
    private async getActivePilotUsers(): Promise<User[]> {
        const activePilotInfiniteFlightIDs = await this.getActivePilotInfiniteFlightIDs()
        const users: User[] = await prismaClient.user.findMany({
            where: {
                infiniteFlightUserID: {
                    in: activePilotInfiniteFlightIDs
                }
            }
        });

        return users;
    }

    /**
     * @returns a list of Infinite Flight User IDs of Active Pilots
     */
    private async getActivePilotInfiniteFlightIDs(): Promise<string[]> {
        const activePilotInfiniteFlightIDs: string[] = [];

        for (var session of this.infiniteFlightStatus.sessions) {
            for (var flight of session.flights) {
                activePilotInfiniteFlightIDs.push(flight.userId)
            }
        }
        return activePilotInfiniteFlightIDs;
    }

}
