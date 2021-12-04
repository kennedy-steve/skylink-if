import { Prisma } from '@prisma/client';
import { ApplicationCommandData, Permissions, PermissionResolvable, CommandInteraction, CacheType, GuildChannel, TextChannel, TextBasedChannels } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { EventData } from '../models/internal-models';
import { Lang, prismaClient } from '../services';
import { ClientUtils, MessageUtils } from '../utils';
import { Command } from './command';

// Abstract class for commands to set notifications for Guild Channels
export abstract class AbstractNotifyCommand implements Command {
    data: ApplicationCommandData;
    requireDev: boolean = false;
    requireGuild: boolean = true;
    requirePerms: PermissionResolvable[] = [
        Permissions.FLAGS.MANAGE_CHANNELS,
    ];
    commandEmbedName: string;

    /**
     * Abstract method for creating a NotificationsChannel record via prisma.
     * This does NOT create a channel in discord. This creates a record in prisma.
     * @param intr 
     * @param channel 
     */
    protected abstract createNotifyChannel(intr: CommandInteraction<CacheType>, channel: GuildChannel): Promise<void>;

    /**
     * Executes the command. Saves a notification channel
     * @param intr 
     * @param data 
     * @returns 
     */
    public async execute(intr: CommandInteraction<CacheType>, data: EventData): Promise<void> {
        let channel: GuildChannel = intr.channel as GuildChannel;

        // Check if channel is specified
        let channelFromOptions: GuildChannel = intr.options.getChannel("channel") as GuildChannel;
        if (channelFromOptions !== null) {

            channel = channelFromOptions;
        }

        if (!channel.isText()) {
            MessageUtils.sendIntr(
                intr,
                Lang.getEmbed(
                    `${this.commandEmbedName}.invalidChannel`,
                    data.lang(),
                    {
                        CHANNEL_ID: channel.id,
                    }
                )
            )

        }
        // Check if bot has permissions to view channel
        else if (!channel.permissionsFor(intr.guild.me).has(Permissions.FLAGS.VIEW_CHANNEL)) {
            MessageUtils.sendIntr(
                intr,
                Lang.getEmbed(
                    `${this.commandEmbedName}.cannotViewChannel`,
                    data.lang(),
                    {
                        CHANNEL_ID: channel.id,
                    }
                )
            )
        }
        // Check if bot has permissions to send messages in channel
        else if (!channel.permissionsFor(intr.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) {
            MessageUtils.sendIntr(
                intr,
                Lang.getEmbed(
                    `${this.commandEmbedName}.cannotSendMessages`,
                    data.lang(),
                    {
                        CHANNEL_ID: channel.id,
                    }
                )
            )
        }
        // Now we're good to go!
        else {
            try {

                await this.createNotifyChannel(intr, channel);
                await MessageUtils.sendIntr(
                    intr,
                    Lang.getEmbed(
                        `${this.commandEmbedName}.subscribed`,
                        data.lang(),
                        {
                            CHANNEL_ID: channel.id,
                        }
                    )
                )

            } catch (error) {

                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2002" && "discordChannelID" === error.meta['target'][0]) {
                        await MessageUtils.sendIntr(
                            intr,
                            Lang.getEmbed(
                                `${this.commandEmbedName}.alreadySubscribed`,
                                data.lang(),
                                {
                                    CHANNEL_ID: channel.id,
                                }
                            )
                        )
                    }
                    else {
                        // TODO: Have an embed for database (prisma) errors
                        throw (error);
                    }
                }
                else {
                    throw (error);
                }
            }
        }

        return;
    }



}