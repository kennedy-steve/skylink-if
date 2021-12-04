import { ActivePilotNotificationsChannel, Prisma } from '.prisma/client';
import { ApplicationCommandData, Permissions, PermissionResolvable, CommandInteraction, CacheType, GuildChannel, TextChannel, TextBasedChannels } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { EventData } from '../models/internal-models';
import { Lang, prismaClient } from '../services';
import { ClientUtils, MessageUtils } from '../utils';
import { AbstractNotifyCommand } from './abstract-notify-command';

export class NotifyActivePilotsCommand extends AbstractNotifyCommand {

    data: ApplicationCommandData = {
        name: "notify-active-pilots",
        description: "Send notifications of active pilots in a channel",
        options: [
            {
                name: "channel",
                description: "The channel to send notifications to",
                type: ApplicationCommandOptionTypes.CHANNEL,
            }
        ]
    };
    commandEmbedName: string = "notifyActivePilotsEmbeds";


    protected async createNotifyChannel(intr: CommandInteraction<CacheType>, channel: GuildChannel): Promise<void> {
        await prismaClient.activePilotNotificationsChannel.create({
            data: {
                discordChannelId: channel.id,
                discordGuildId: intr.guildId
            }
        })
    }





}