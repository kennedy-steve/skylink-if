import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

import { EventData } from '../models/internal-models';
import { Lang, Logger, prismaClient } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';
import * as infiniteFlightLive from '../lib/infinite-flight-live';
import { Prisma } from '.prisma/client';
import { off } from 'process';
import { UserStats } from '../lib/infinite-flight-live/types';



export class RegisterMeCommand implements Command {
    public data: ApplicationCommandData = {
        name: 'register-me',
        description: 'Register your Infinite Flight Username',
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

    public async execute(commandInteraction: CommandInteraction, data: EventData): Promise<void> {
        const ifcUsername = commandInteraction.options.getString('ifc-username');

        if (ifcUsername == null) {
            await MessageUtils.sendIntr(commandInteraction, `Please specify ifc-username (infinite flight username)`);
            return
        }
        else {
            const userHits = await infiniteFlightLive.userStats([], [], [ifcUsername]);

            if (userHits.length == 0) {
                await MessageUtils.sendIntr(commandInteraction, `Sorry, I couldn't find anyone named ${ifcUsername} on Infinite Flight`);
            }
            else {

                // Get their infinite flight user stats
                const userStats = userHits[0]
                this.createNewUser(commandInteraction, userStats);
            }
        }
    }

    private async createNewUser(commandInteraction: CommandInteraction, userStats: UserStats) {
        const discordUserID = commandInteraction.member.user.id;
        const infiniteFlightUserID = userStats.userId;
        const ifcUsername = userStats.discourseUsername;
        try {
            const newUser = await prismaClient.user.create({
                data: {
                    discordUserID: discordUserID,
                    infiniteFlightUserID: infiniteFlightUserID,
                }
            });
            Logger.info(`Registered user - IFC username: ${ifcUsername}`);

            await MessageUtils.sendIntr(commandInteraction, `${ifcUsername} is now associated with your Discord <@${discordUserID}>!`);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                const prismaErrorCode = error.code;

                // Handle when unique constant is violated
                if (prismaErrorCode === 'P2002') {
                    const offendingFields = error.meta["target"];
                    if (offendingFields.includes("infiniteFlightUserID")) {
                        await MessageUtils.sendIntr(commandInteraction, `${ifcUsername} is already registered, either by you or another Discord user`);
                    }
                    else if (offendingFields.includes("discordUserID")) {

                        await MessageUtils.sendIntr(commandInteraction, `We've updated ${ifcUsername} to be your registered infinite flight user  <@${discordUserID}>!`);
                    }
                    else {
                        throw (error);
                    }
                }
                else {
                    throw (error);
                }
            }
        }
    }

    private async updateUser(commandInteraction: CommandInteraction, userStats: UserStats) {
        const discordUserID = commandInteraction.member.user.id;
        const infiniteFlightUserID = userStats.userId;
        const ifcUsername = userStats.discourseUsername;

        const updatedUser = await prismaClient.user.update({
            where: {
                discordUserID: discordUserID,
            },
            data: {
                infiniteFlightUserID: infiniteFlightUserID,
            }
        });
        Logger.info(`Updated user - IFC username: ${ifcUsername}`);
    }
}
