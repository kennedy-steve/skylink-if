import { Prisma } from '@prisma/client';
import { ApplicationCommandOptionType } from 'discord-api-types';
import { ApplicationCommandData, Permissions, PermissionResolvable, CommandInteraction, CacheType, GuildChannel, TextChannel, TextBasedChannels } from 'discord.js';
import { ApplicationCommandOptionTypes, ChannelTypes } from 'discord.js/typings/enums';
import { NotificationType } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang, Logger, prismaClient } from '../services';
import { ClientUtils, MessageUtils } from '../utils';
import { Command } from './command';

// Abstract class for commands to set notifications for Guild Channels
export class EnableNotificationsCommand implements Command {

    public requireDev: false;
    public requireGuild: true;
    public requirePerms: PermissionResolvable[] = [
        Permissions.FLAGS.MANAGE_CHANNELS,
    ];
    public commandEmbedName: string = 'enableNotificationsEmbeds';

    public data: ApplicationCommandData = {
        name: "enable-notifications",
        description: "Enable notifications in a channel",
        options: [
            {
                name: "channel",
                description: "The channel to enable notifications",
                type: ApplicationCommandOptionTypes.CHANNEL,
                channelTypes: [ChannelTypes.GUILD_TEXT],
            },
            {
                name: "notification-type",
                description: "The type of notification to enable",
                type: ApplicationCommandOptionType.String.valueOf(),
                choices: [
                    {
                        name: Lang.getRef(
                            'notificationTypeDescriptions.ACTIVE_PILOT',
                            Lang.Default
                        ),
                        value: NotificationType.ACTIVE_PILOT
                    },
                    {
                        name: Lang.getRef(
                            'notificationTypeDescriptions.ACTIVE_CONTROLLER',
                            Lang.Default
                        ),
                        value: NotificationType.ACTIVE_CONTROLLER
                    },
                    {
                        name: Lang.getRef(
                            'notificationTypeDescriptions.ALL',
                            Lang.Default
                        ),
                        value: NotificationType.ALL
                    },
                ]
            }
        ]
    }

    private async enableActivePilotNotifications(
        intr: CommandInteraction,
        data: EventData,
        channel: GuildChannel,
    ): Promise<void> {
        try {
            await prismaClient.activePilotNotificationsChannel.create({
                data: {
                    discordChannelId: channel.id,
                    discordGuildId: intr.guildId,
                }
            });
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed(
                    `${this.commandEmbedName}.success`,
                    data.lang(),
                    {
                        CHANNEL_ID: channel.id,
                        NOTIFICATION_TYPE: Lang.getRef(
                            `notificationTypeDescriptions.${NotificationType.ACTIVE_PILOT}`,
                            data.lang()
                        ),
                    }
                )
            )
        } catch (error) {
            await this.catchActiveUserNotificationsChannelAlreadyCreated(
                intr,
                data,
                channel,
                error,
                NotificationType.ACTIVE_PILOT
            )
        }
    }

    private async enableActiveControllerNotifications(
        intr: CommandInteraction,
        data: EventData,
        channel: GuildChannel,
    ): Promise<void> {
        try {
            await prismaClient.activeControllerNotificationsChannel.create({
                data: {
                    discordChannelId: channel.id,
                    discordGuildId: intr.guildId,
                }
            });
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed(
                    `${this.commandEmbedName}.success`,
                    data.lang(),
                    {
                        CHANNEL_ID: channel.id,
                        NOTIFICATION_TYPE: Lang.getRef(
                            `notificationTypeDescriptions.${NotificationType.ACTIVE_CONTROLLER}`,
                            data.lang()
                        ),
                    }
                )
            )
        } catch (error) {
            await this.catchActiveUserNotificationsChannelAlreadyCreated(
                intr,
                data,
                channel,
                error,
                NotificationType.ACTIVE_CONTROLLER
            );
            Logger.info(error);
        }
    }

    /**
     * Enable specific or all Notifications in a Channel
     * This creates a NotificationsChannel record via prisma.
     * This does NOT create a channel in discord. This creates a record in prisma.
     * @param intr 
     * @param channel 
     */
    protected async enableNotifications(intr: CommandInteraction, data: EventData, channel: GuildChannel, notificationType: string): Promise<void> {

        // Enable notifications for active pilot
        if (notificationType === NotificationType.ACTIVE_PILOT) {
            await this.enableActivePilotNotifications(
                intr,
                data,
                channel,
            )
        }

        // enable notifications for active controller
        else if (notificationType === NotificationType.ACTIVE_CONTROLLER) {
            await this.enableActiveControllerNotifications(
                intr,
                data,
                channel,
            );
        }

        // Default is to enable all notifications
        else {

        }
    }

    /**
     * Reply that channel has already enabled certain notifications 
     * @param intr 
     * @param data 
     * @param channel 
     * @param error 
     * @param notificationType 
     */
    protected async catchActiveUserNotificationsChannelAlreadyCreated(
        intr: CommandInteraction,
        data: EventData,
        channel: GuildChannel,
        error: Error,
        notificationType: string,
    ): Promise<void> {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002" && "discordChannelId" === error.meta['target'][0]) {
                await MessageUtils.sendIntr(
                    intr,
                    Lang.getEmbed(
                        `${this.commandEmbedName}.alreadyEnabled`,
                        data.lang(),
                        {
                            CHANNEL_ID: channel.id,
                            NOTIFICATION_TYPE: Lang.getRef(
                                `notificationTypeDescriptions.${notificationType}`,
                                data.lang()
                            ),
                        }
                    )
                );
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
            await MessageUtils.sendIntr(
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
            await MessageUtils.sendIntr(
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
            await MessageUtils.sendIntr(
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
            let notificationType: string = intr.options.getString("notification-type");
            // Default notification type is ALL
            if (notificationType === null) {
                notificationType = 'ALL';
            }

            Logger.info(`notification type = ${notificationType}`);
            await this.enableNotifications(
                intr,
                data,
                channel,
                notificationType,
            )
        }

        return;
    }



}