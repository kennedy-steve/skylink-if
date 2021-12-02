import { ActivePilotNotifications, Prisma } from '.prisma/client';
import { ApplicationCommandData, Permissions, PermissionResolvable, CommandInteraction, CacheType, GuildChannel, TextChannel, TextBasedChannels } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { EventData } from '../models/internal-models';
import { Lang, prismaClient } from '../services';
import { ClientUtils, MessageUtils } from '../utils';
import { Command } from './command';

export class NotifyActivePilotsCommand implements Command {
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
    requireDev: boolean = false;
    requireGuild: boolean = true;
    requirePerms: PermissionResolvable[] = [
        Permissions.FLAGS.MANAGE_CHANNELS,
    ];

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
                    'notifyActivePilotsEmbeds.invalidChannel',
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
                    'notifyActivePilotsEmbeds.cannotViewChannel',
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
                    'notifyActivePilotsEmbeds.cannotSendMessages',
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

                const activePilotNotification: ActivePilotNotifications = await prismaClient.activePilotNotifications.create({
                    data: {
                        discordChannelID: channel.id,
                        discordServerID: intr.guildId
                    }
                })

                await MessageUtils.sendIntr(
                    intr,
                    Lang.getEmbed(
                        "notifyActivePilotsEmbeds.subscribed",
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
                                "notifyActivePilotsEmbeds.alreadySubscribed",
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