import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';
import * as infiniteFlightLive from '../lib/infinite-flight-live';

export class getPilotCommand implements Command {
    public data: ApplicationCommandData = {
        name: Lang.getCom('commands.get-pilot'),
        description: Lang.getRef('commandDescs.get-pilot', Lang.Default),
        options: [
            {
                name: "ifc-username",
                description: "sup",
                type: ApplicationCommandOptionTypes.STRING

            }
        ]
    };
    public requireDev = false;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        const if_username = intr.options.getString('ifc-username');



        if (if_username == null) {
            await MessageUtils.sendIntr(intr, `Please specify ifc-username (infinite flight username)`);
            return
        }
        else {
            const userHits = await infiniteFlightLive.userStats([], [], [if_username]);

            if (userHits.length == 0) {
                await MessageUtils.sendIntr(intr, `Sorry, I couldn't find anyone named ${if_username} on Infinite Flight`);
            }
            else {
                const userStats = userHits[0];
                await MessageUtils.sendIntr(intr, `${if_username} has landed ${userStats.landingCount} times and also has ${userStats.violations} violations 💩`);
            }
        }

    }
}
