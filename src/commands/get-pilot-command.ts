import { ApplicationCommandData, CommandInteraction, PermissionString } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import { MessageUtils } from '../utils/index.js';
import { Command, CommandDeferType } from './command.js';
import * as infiniteFlightLive from '../lib/infinite-flight-live/index.js';

export class GetPilotCommand implements Command {
    public metadata: ApplicationCommandData = {
        name: Lang.getCom('commands.getPilot'),
        description: Lang.getRef('commandDescs.getPilot', Lang.Default),
        options: [
            {
                name: "ifc-username",
                description: "The Pilot's username on Infinite Flight Community",
                type: ApplicationCommandOptionTypes.STRING

            }
        ]
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireDev = false;
    public requireGuild = false;
    requireClientPerms: PermissionString[] = [];
    requireUserPerms: PermissionString[] = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        const ifcUsername = intr.options.getString('ifc-username');

        if (ifcUsername == null) {
            await MessageUtils.sendIntr(intr, `Please specify ifc-username (infinite flight username)`);
            return
        }
        else {
            const userHits = await infiniteFlightLive.userStats([], [], [ifcUsername]);

            if (userHits.length == 0) {
                await MessageUtils.sendIntr(intr, `Sorry, I couldn't find anyone named ${ifcUsername} on Infinite Flight`);
            }
            else {
                const userStats = userHits[0];
                await MessageUtils.sendIntr(intr, `${ifcUsername} has landed ${userStats.landingCount} times and also has ${userStats.violations} violations 💩`);
            }
        }

    }
}
