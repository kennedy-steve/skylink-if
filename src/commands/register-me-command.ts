import { ApplicationCommandData, CommandInteraction, GuildMember, User as DiscordUser } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

import { EventData } from '../models/internal-models';
import { Lang, Logger, prismaClient } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';
import * as infiniteFlightLive from '../lib/infinite-flight-live';
import { prisma, Prisma, User, VerifyInfiniteFlightUserIDTicket } from '.prisma/client';
import { off } from 'process';
import { Aircraft, UserStats } from '../lib/infinite-flight-live/types';
import { VerifyInfiniteFlightUserIDTicketUtils } from '../utils/verify-infinite-flight-user-id-ticket-utils';

let Config = require('../../config/config.json');
let InfiniteFlightPlanes = require('../../static/infinite-flight-planes.json');

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

    private ifcUsername;
    private discordUser;
    private user;

    public async execute(commandInteraction: CommandInteraction, data: EventData): Promise<void> {
        this.ifcUsername = commandInteraction.options.getString('ifc-username');
        const discordUser: DiscordUser = commandInteraction.member.user as DiscordUser;
        const discordGuild = commandInteraction.guild;
        const discordMember: GuildMember = commandInteraction.member as GuildMember;



        // first check if user already has a fresh verification ticket to prevent abuse
        const userHasFreshVerificationTicket: boolean = await this.checkIfUserStillHasFreshVerificationTicket(discordUser.id);
        if (userHasFreshVerificationTicket) {
            await MessageUtils.sendIntr(
                commandInteraction,
                `You recently requested to register. To prevent abuse, please wait ${Config.modelConstants.verifyInfiniteFlightUserIDTicket.staleByMinutes} before requesting again`
            );
        }

        // check if the user specified an ifc username
        else if (this.ifcUsername == null) {
            await MessageUtils.sendIntr(commandInteraction, `Please specify ifc-username (infinite flight username)`);
        }
        else {
            const userHits = await infiniteFlightLive.userStats([], [], [this.ifcUsername]);

            // check if the ifc user exists
            if (userHits.length == 0) {
                await MessageUtils.sendIntr(commandInteraction, `Sorry, I couldn't find anyone named ${this.ifcUsername} on Infinite Flight`);
            }
            else {
                const userStats = userHits[0]
                const infiniteFlightUserAlreadyRegistered: boolean = await this.checkIfInfiniteFlightUserAlreadyRegistered(userStats.userId);

                // check if the infinite flight user has already been registered
                if (infiniteFlightUserAlreadyRegistered) {
                    await MessageUtils.sendIntr(commandInteraction, `Sorry, looks like either your or someone else has registered ${this.ifcUsername}`);
                }
                else {
                    await prismaClient.user.upsert({
                        where: {
                            discordUserID: discordUser.id
                        },
                        update: {},
                        create: {
                            discordUserID: discordUser.id
                        },
                    });

                    const newVerifyInfiniteFlightUserIDTicket: VerifyInfiniteFlightUserIDTicket = await this.createVerifyInfiniteFlightUserIDTicket(
                        userStats.userId,
                        discordUser.id,
                        discordGuild.id,
                    );
                    await discordMember.send(
                        `To register as ${this.ifcUsername}, please spawn in a live server as a ${newVerifyInfiniteFlightUserIDTicket.aircraftName}, using ${newVerifyInfiniteFlightUserIDTicket.liveryName} as your livery. And turn to the TRUE heading of ${newVerifyInfiniteFlightUserIDTicket.heading}. Our ground crew will check on you to verify shortly`
                    );
                    await MessageUtils.sendIntr(
                        commandInteraction,
                        `Check your DMs!`
                    );
                }

            }
        }
    }

    private async createVerifyInfiniteFlightUserIDTicket(infiniteFlightUserID: string, discordUserId: string, discordGuildID: string): Promise<VerifyInfiniteFlightUserIDTicket> {
        const randomHeading: number = this.getRandomHeading();
        const randomAircraft: Aircraft = this.getRandomAircraft();
        const verifyInfiniteFlightUserIDTicket: VerifyInfiniteFlightUserIDTicket = await prismaClient.verifyInfiniteFlightUserIDTicket.create({
            data: {
                infiniteFlightUserID: infiniteFlightUserID,
                discordUserID: discordUserId,
                discordGuildID: discordGuildID,
                aircraftID: randomAircraft.aircraftID,
                aircraftName: randomAircraft.aircraftName,
                liveryID: randomAircraft.liveryID,
                liveryName: randomAircraft.liveryName,
                heading: randomHeading,
            }
        })
        return verifyInfiniteFlightUserIDTicket;
    }

    private getRandomHeading(): number {
        const randomHeading = Math.floor(Math.random() * 360) + 1;
        return randomHeading;
    }

    private getRandomAircraft(): Aircraft {
        const randomAircraft: Aircraft = InfiniteFlightPlanes[(Math.floor(Math.random() * InfiniteFlightPlanes.length))];
        return randomAircraft;
    }

    private async checkIfUserStillHasFreshVerificationTicket(discordUserID: string): Promise<boolean> {
        const freshTicketsCutoffDateTime: Date = VerifyInfiniteFlightUserIDTicketUtils.getFreshTicketsCutoffDateTime();

        const verificationTicket: VerifyInfiniteFlightUserIDTicket = await prismaClient.verifyInfiniteFlightUserIDTicket.findFirst({
            where: {
                discordUserID: discordUserID,
                created: {
                    gt: freshTicketsCutoffDateTime
                }
            }
        })
        return (verificationTicket !== null);
    }

    /**
     * 
     * @param infiniteFlightUserID 
     * @returns if Infinite Flight user is already registered
     */
    private async checkIfInfiniteFlightUserAlreadyRegistered(infiniteFlightUserID: string): Promise<boolean> {
        const user: User = await prismaClient.user.findUnique({
            where: {
                infiniteFlightUserID: infiniteFlightUserID
            }
        });

        // return if user is not null
        return (user !== null);
    }



}
