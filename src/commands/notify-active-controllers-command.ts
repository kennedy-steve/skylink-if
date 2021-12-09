import { ApplicationCommandData, Permissions, PermissionResolvable, CommandInteraction, CacheType, GuildChannel, TextChannel, TextBasedChannels } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { Lang, prismaClient } from '../services';
import { ClientUtils, MessageUtils } from '../utils';
import { AbstractNotifyCommand } from './abstract-notify-command';

export class NotifyActiveControllersCommand extends AbstractNotifyCommand {
    data: ApplicationCommandData = {
        name: 'notify-active-controllers',
        description: 'Send notifications of active controllers in a channel',
        options: [
            {
                name: "channel",
                description: "The channel to send the notifications in",
                type: ApplicationCommandOptionTypes.CHANNEL,
            }
        ]
    };
    commandEmbedName: string = "notifyActiveControllersEmbeds";

    protected async createNotifyChannel(intr: CommandInteraction<CacheType>, channel: GuildChannel): Promise<void> {
        await prismaClient.activeControllerNotificationsChannel.create({
            data: {
                discordChannelId: channel.id,
                discordGuildId: intr.guildId,
            }
        })
    }

}
