import { CommandInteraction, NewsChannel, TextChannel, ThreadChannel } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventHandler } from '.';
import { Command, CommandDeferType } from '../commands';
import { Config } from '../config';
import { EventData } from '../models/internal-models';
import { Lang, Logger } from '../services';
import { CommandUtils, MessageUtils } from '../utils';

let Logs = require('../../lang/logs.json');

export class CommandHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.commands.AMOUNT,
        Config.rateLimiting.commands.INTERVAL * 1000
    );

    constructor(public commands: Command[]) { }

    public async process(intr: CommandInteraction): Promise<void> {
        // Don't respond to self, or other bots
        if (intr.user.id === intr.client.user?.id || intr.user.bot) {
            return;
        }

        // Check if user is rate limited
        let limited = this.rateLimiter.take(intr.user.id);
        if (limited) {
            return;
        }

        // Try to find the command the user wants
        let command = this.commands.find(command => command.metadata.name === intr.commandName);
        if (!command) {
            Logger.error(
                Logs.error.commandNotFound
                    .replaceAll('{INTERACTION_ID}', intr.id)
                    .replaceAll('{COMMAND_NAME}', intr.commandName)
            );
            return;
        }

        // Defer interaction
        // NOTE: Anything after this point we should be responding to the interaction
        switch (command.deferType) {
            case CommandDeferType.PUBLIC: {
                await MessageUtils.deferReply(intr, false);
                break;
            }
            case CommandDeferType.HIDDEN: {
                await MessageUtils.deferReply(intr, true);
                break;
            }
        }

        // TODO: Get data from database
        let data = new EventData();

        try {
            // Check if interaction passes command checks
            let passesChecks = await CommandUtils.runChecks(command, intr, data);
            if (passesChecks) {
                // Execute the command
                await command.execute(intr, data);
            }
        } catch (error) {
            await this.sendError(intr, data);

            // Log command error
            Logger.error(
                intr.channel instanceof TextChannel ||
                    intr.channel instanceof NewsChannel ||
                    intr.channel instanceof ThreadChannel
                    ? Logs.error.commandGuild
                        .replaceAll('{INTERACTION_ID}', intr.id)
                        .replaceAll('{COMMAND_NAME}', command.metadata.name)
                        .replaceAll('{USER_TAG}', intr.user.tag)
                        .replaceAll('{USER_ID}', intr.user.id)
                        .replaceAll('{CHANNEL_NAME}', intr.channel.name)
                        .replaceAll('{CHANNEL_ID}', intr.channel.id)
                        .replaceAll('{GUILD_NAME}', intr.guild?.name)
                        .replaceAll('{GUILD_ID}', intr.guild?.id)
                    : Logs.error.commandOther
                        .replaceAll('{INTERACTION_ID}', intr.id)
                        .replaceAll('{COMMAND_NAME}', command.metadata.name)
                        .replaceAll('{USER_TAG}', intr.user.tag)
                        .replaceAll('{USER_ID}', intr.user.id),
                error
            );
        }
    }

    private async sendError(intr: CommandInteraction, data: EventData): Promise<void> {
        try {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('errorEmbeds.command', data.lang(), {
                    ERROR_CODE: intr.id,
                })
            );
        } catch {
            // Ignore
        }
    }
}
