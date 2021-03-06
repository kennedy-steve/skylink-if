import { CommandInteraction, GuildChannel, GuildMember, Permissions } from 'discord.js';
import { Command } from '../commands/index.js';
import { Config } from '../config.js';
import { Permission } from '../models/enums/index.js';
import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import { FormatUtils, MessageUtils } from './index.js';

export class CommandUtils {
    public static async runChecks(
        command: Command,
        intr: CommandInteraction,
        data: EventData
    ): Promise<boolean> {
        if (command.cooldown) {
            let limited = command.cooldown.take(intr.user.id);
            if (limited) {
                await MessageUtils.sendIntr(
                    intr,
                    Lang.getEmbed('validationEmbeds.cooldownHit', data.lang(), {
                        AMOUNT: command.cooldown.amount.toLocaleString(),
                        INTERVAL: FormatUtils.duration(command.cooldown.interval, data.lang()),
                    })
                );
                return;
            }
        }

        if (command.requireDev && !Config.DEVELOPERS.includes(intr.user.id)) {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('validationEmbeds.devOnlyCommand', data.lang())
            );
            return false;
        }

        if (command.requireGuild && !intr.guild) {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('validationEmbeds.serverOnlyCommand', data.lang())
            );
            return false;
        }

        if (
            intr.channel instanceof GuildChannel &&
            !intr.channel.permissionsFor(intr.client.user).has(command.requireClientPerms)
        ) {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('validationEmbeds.missingClientPerms', data.lang(), {
                    PERMISSIONS: command.requireClientPerms
                        .map(perm => `**${Permission.Data[perm].displayName(data.lang())}**`)
                        .join(', '),
                })
            );
            return false;
        }

        // TODO: Remove "as GuildMember",  why does discord.js have intr.member as a "APIInteractionGuildMember"?
        if (intr.member && !this.hasPermission(intr.member as GuildMember, command)) {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('validationEmbeds.missingUserPerms', data.lang())
            );
            return false;
        }

        return true;
    }

    private static hasPermission(member: GuildMember, command: Command): boolean {
        // Debug option to bypass permission checks
        if (!Config.development.CHECK_PERMS) {
            return true;
        }

        // Developers, server owners, and members with "Manage Server" have permission for all commands
        if (
            member.guild.ownerId === member.id ||
            member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) ||
            Config.DEVELOPERS.includes(member.id)
        ) {
            return true;
        }

        // Check if member has required permissions for command
        if (!member.permissions.has(command.requireUserPerms)) {
            return false;
        }

        return true;
    }
}
