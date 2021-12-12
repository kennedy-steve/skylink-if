import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

import { off } from 'process';
import * as infiniteFlightLive from '../lib/infinite-flight-live';
import { UserStats } from '../lib/infinite-flight-live/types';
import { EventData } from '../models/internal-models';
import { Lang, Logger, prismaClient } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';
import { Prisma } from '.prisma/client';



export class InfiniteFlightStatusCommand implements Command {
    public data: ApplicationCommandData = {
        name: 'infinite-flight-status',
        description: 'Pretty self explanatory ;)',
    };
    public requireDev = false;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(commandInteraction: CommandInteraction, data: EventData): Promise<void> {
        const infiniteFlightStatus = await infiniteFlightLive.getInfiniteFlightStatus();
        const pilots = [];

        for (let infiniteFlightSession of infiniteFlightStatus.sessions) {
            for (let flight of infiniteFlightSession.flights) {
                pilots.push(flight.username);
            }
        }
        Logger.info(pilots.toString());
        await MessageUtils.sendIntr(commandInteraction, `${pilots.slice(0, 100).toString()}`);
    }

}
