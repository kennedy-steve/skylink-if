import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

import { EventData } from '../models/internal-models';
import { Lang, Logger, prismaClient } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';
import * as infiniteFlightLive from '../lib/infinite-flight-live';
import { Prisma } from '.prisma/client';
import { off } from 'process';
import { UserStats } from '../lib/infinite-flight-live/types';



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

        for (var infiniteFlightSession of infiniteFlightStatus.sessions) {
            for (var flight of infiniteFlightSession.flights) {
                pilots.push(flight.username);
            }
        }
        Logger.info(pilots.toString());
        await MessageUtils.sendIntr(commandInteraction, `${pilots.slice(0, 100).toString()}`);
    }

}
