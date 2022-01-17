import { ApplicationCommandData, CommandInteraction, PermissionString } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { EventData } from '../models/internal-models.js';
import { Logger } from '../services/index.js';
import { MessageUtils } from '../utils/index.js';
import { Command, CommandDeferType } from './command.js';
import * as infiniteFlightLive from '../lib/infinite-flight-live/index.js';



export class InfiniteFlightStatusCommand implements Command {
    public metadata: ApplicationCommandData = {
        name: 'infinite-flight-status',
        description: 'Pretty self explanatory ;)',
    };
    public requireDev = false;
    public requireGuild = false;
    public deferType: CommandDeferType.PUBLIC;
    requireClientPerms: PermissionString[] = [];
    requireUserPerms: PermissionString[] = [];

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
