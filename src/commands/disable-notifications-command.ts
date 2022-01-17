import { ApplicationCommandOptionType } from 'discord-api-types';
import { ApplicationCommandData, ApplicationCommandOptionChoice, CacheType, CommandInteraction, GuildChannel, PermissionResolvable, Permissions, PermissionString } from 'discord.js';
import { ApplicationCommandOptionTypes, ChannelTypes } from 'discord.js/typings/enums';
import { EventData } from '../models/internal-models.js';
import { Lang, prismaClient } from '../services/index.js';
import { MessageUtils } from '../utils/index.js';
import { Command, CommandDeferType } from './command.js';
import { ActiveControllerNotificationsChannel, ActivePilotNotificationsChannel, Prisma } from '.prisma/client/index.js';


// Disable notifications to channel
export class DisableNotificationsCommand implements Command {
    public requireDev: false;
    public requireGuild: true;
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];
    public requireUserPerms: PermissionString[] = [
        "MANAGE_CHANNELS",
    ];
    public commandEmbedName: string = 'disableNotificationsEmbeds';

    public metadata: ApplicationCommandData = {
        name: 'disable-notifications',
        description: 'Disable notifications to a channel',
        options: [
            {
                name: 'channel',
                description: 'The channel to disable notifications',
                type: ApplicationCommandOptionTypes.CHANNEL,
                channelTypes: [ChannelTypes.GUILD_TEXT],
            },
            {
                name: 'notification-type',
                description: 'The type of notification to disable',
                type: ApplicationCommandOptionType.String.valueOf(),
                choices: [
                    {
                        name: 'Active Pilot Notifications',
                        value: 'PILOT'
                    },
                    {
                        name: 'Active Controller Notifications',
                        value: 'CONTROLLER'
                    },
                    {
                        name: 'All Active User Notifications',
                        value: 'ALL'
                    },
                ]
            }
        ]
    }

    /**
     * Disables Active Controller notifications to channel by deleting it from the database
     * @param intr
     * @param channel
     * @returns the deleted Channel ID
     */
    protected async disableControllerNotifications(intr: CommandInteraction<CacheType>, channel: GuildChannel): Promise<string> {
        let ActiveControllerNotificationsChannel: ActiveControllerNotificationsChannel = await prismaClient.activeControllerNotificationsChannel.delete({
            where: {
                discordChannelId: channel.id
            }
        });
        return ActiveControllerNotificationsChannel.discordChannelId;
    }


    /**
     * Disables Active Pilot notifications to channel by deleting it from the database
     * @param intr: CommandInteraction
     * @param channel: The channel to disable notifications
     * @return the deleted Channel ID
     */
    protected async disablePilotNotifications(intr: CommandInteraction<CacheType>, channel: GuildChannel): Promise<string> {
        let deletedActivePilotNotificationsChannel: ActivePilotNotificationsChannel = await prismaClient.activePilotNotificationsChannel.delete({
            where: {
                discordChannelId: channel.id
            }
        })
        return deletedActivePilotNotificationsChannel.discordChannelId;
    }

    /**
     * Catch error if channel is not in database
     * This would mean notifications were never enabled
     * @param intr The Command Interaction
     * @param data The Event Data
     * @param error The error that was thrown
     * @param channel The discord channel where notifications were attempted to be disabled
     * @param notificationTypeDescription The description of the notification type that was attempted to be disabled
     * @returns void
     */
    protected catchActiveUserNotificationsChannelNotFound(
        intr: CommandInteraction<CacheType>,
        data: EventData,
        error: Error,
        channel: GuildChannel,
        notificationTypeDescription: string
    ): void {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {

            // Check if channel notifications were never enabled
            // This would mean that the channel was never added to the database
            if (error.code === 'P2025') {
                MessageUtils.sendIntr(
                    intr,
                    Lang.getEmbed(
                        `${this.commandEmbedName}.notEnabled`,
                        data.lang(),
                        {
                            CHANNEL_ID: channel.id,
                            NOTIFICATION_TYPE: notificationTypeDescription,
                        }
                    )
                );
            }
            else {
                // TODO: Have a better error message for prisma error
                throw (error);
            }
        }
        else {
            throw (error);
        }
    }

    /**
     * Send message that notifications have been disabled
     * @param intr
     * @param data
     * @param channel The channel to disable notifications
     * @param notificationTypeDescription The description of the notification type that was disabled
     */
    protected async sendSuccessfullyDisabledNotificationsMessage(
        intr: CommandInteraction<CacheType>,
        data: EventData,
        channel: GuildChannel,
        notificationTypeDescription: string
    ): Promise<void> {
        MessageUtils.sendIntr(
            intr,
            Lang.getEmbed(
                `${this.commandEmbedName}.success`,
                data.lang(),
                {
                    CHANNEL_ID: channel.id,
                    NOTIFICATION_TYPE: notificationTypeDescription,
                }
            )
        );
    }

    /**
     * Disable Active User notifications based on user input
     * @param intr
     * @param data
     * @param channel The channel to disable notifications
     * @param notificationType Notification Type
     */
    protected async disableNotifications(intr: CommandInteraction<CacheType>, data: EventData, channel: GuildChannel, notificationType: string): Promise<void> {
        // Default notification type is ALL
        if (notificationType == null) {
            notificationType = 'ALL';
        }

        if (notificationType.toUpperCase() == 'PILOT') {
            try {
                await this.disablePilotNotifications(intr, channel);
                await this.sendSuccessfullyDisabledNotificationsMessage(intr, data, channel, 'Active Pilot Notifications');
            } catch (error) {
                this.catchActiveUserNotificationsChannelNotFound(
                    intr,
                    data,
                    error,
                    channel,
                    'Active Pilot'
                );
            }
        }
        else if (notificationType.toUpperCase() == 'CONTROLLER') {
            try {
                await this.disableControllerNotifications(intr, channel);
                await this.sendSuccessfullyDisabledNotificationsMessage(intr, data, channel, 'Active Controller Notifications');
            } catch (error) {
                this.catchActiveUserNotificationsChannelNotFound(
                    intr,
                    data,
                    error,
                    channel,
                    'Active Controller'
                );
            }
        }
        else {
            // try to disable all notifications
            try {
                await this.disablePilotNotifications(intr, channel);
                await this.sendSuccessfullyDisabledNotificationsMessage(intr, data, channel, 'Active Pilot Notifications');
            } catch (error) {
                this.catchActiveUserNotificationsChannelNotFound(
                    intr,
                    data,
                    error,
                    channel,
                    'Active Pilot'
                );
            }

            try {
                await this.disableControllerNotifications(intr, channel);
                await this.sendSuccessfullyDisabledNotificationsMessage(intr, data, channel, 'Active Controller Notifications');
            } catch (error) {
                this.catchActiveUserNotificationsChannelNotFound(
                    intr,
                    data,
                    error,
                    channel,
                    'Active Controller'
                );
            }
        }

        return;
    }



    /**
     * Execute command
     * @param intr
     * @param data
     */
    public async execute(intr: CommandInteraction<CacheType>, data: EventData): Promise<void> {
        let channel: GuildChannel = intr.channel as GuildChannel;

        // Check if channel is specified
        let channelFromOptions: GuildChannel = intr.options.getChannel('channel') as GuildChannel;
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
        else {
            // Now we can disable notifications
            let notificationType: string = intr.options.getString('notification-type');
            await this.disableNotifications(intr, data, channel, notificationType);
        }


    }
}