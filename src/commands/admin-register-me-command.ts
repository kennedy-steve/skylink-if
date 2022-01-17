import { ApplicationCommandData, CommandInteraction, PermissionString } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { EventData } from '../models/internal-models.js';
import { Lang, Logger, prismaClient } from '../services/index.js';
import { MessageUtils } from '../utils/index.js';
import { Command, CommandDeferType } from './command.js';
import * as infiniteFlightLive from '../lib/infinite-flight-live/index.js';
import { Prisma } from '.prisma/client/index.js';
import { off } from 'node:process';
import { UserStats } from '../lib/infinite-flight-live/types.js';



export class AdminRegisterMeCommand implements Command {
    public metadata: ApplicationCommandData = {
        name: 'admin-register-me',
        description: '(Admin use only) Register your Infinite Flight Username',
        options: [
            {
                name: "ifc-username",
                description: "sup",
                type: ApplicationCommandOptionTypes.STRING

            }
        ]
    };
    public requireDev = true;
    public requireGuild = false;
    public requirePerms = [];
    public deferType: CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];
    public requireUserPerms: PermissionString[] = [];

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
        const discordUserId = commandInteraction.member.user.id;
        const infiniteFlightUserId = userStats.userId;
        const ifcUsername = userStats.discourseUsername;
        try {
            Logger.info(`Creating new user - IFC username: ${ifcUsername}`);
            const newUser = await prismaClient.user.create({
                data: {
                    discordUserId: discordUserId,
                    infiniteFlightUserId: infiniteFlightUserId,
                }
            });
            Logger.info(`Registered user - IFC username: ${ifcUsername}`);

            await MessageUtils.sendIntr(commandInteraction, `${ifcUsername} is now associated with your Discord <@${discordUserId}>!`);
        } catch (error) {

            Logger.info(`Error creating new user - IFC username: ${ifcUsername}`);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                const prismaErrorCode = error.code;

                // Handle when unique constant is violated
                if (prismaErrorCode === 'P2002') {
                    const offendingFields = error.meta["target"];
                    if (offendingFields.includes("infiniteFlightUserId")) {
                        await MessageUtils.sendIntr(commandInteraction, `${ifcUsername} is already registered, either by you or another Discord user`);
                    }
                    else if (offendingFields.includes("discordUserId")) {

                        await MessageUtils.sendIntr(commandInteraction, `We've updated ${ifcUsername} to be your registered infinite flight user  <@${discordUserId}>!`);
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
        const discordUserId = commandInteraction.member.user.id;
        const infiniteFlightUserId = userStats.userId;
        const ifcUsername = userStats.discourseUsername;

        const updatedUser = await prismaClient.user.update({
            where: {
                discordUserId: discordUserId,
            },
            data: {
                infiniteFlightUserId: infiniteFlightUserId,
            }
        });
        Logger.info(`Updated user - IFC username: ${ifcUsername}`);
    }
}
