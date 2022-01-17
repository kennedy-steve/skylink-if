import { ApplicationCommandData, CommandInteraction, GuildMember, PermissionString, User as DiscordUser } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { Config } from '../config.js';
import * as infiniteFlightLive from '../lib/infinite-flight-live/index.js';
import { Aircraft, UserStats } from '../lib/infinite-flight-live/types.js';
import { EventData } from '../models/internal-models.js';
import { Lang, Logger, prismaClient } from '../services/index.js';
import { MessageUtils } from '../utils/index.js';
import { VerifyInfiniteFlightUserIdTicketUtils } from '../utils/verify-infinite-flight-user-id-ticket-utils.js';
import { Command, CommandDeferType } from './command.js';
import { prisma, Prisma, User, VerifyInfiniteFlightUserIdTicket } from '.prisma/client/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let InfiniteFlightPlanes = require('../../infinite-flight-data/aircraft-and-liveries-list.json');

export class RegisterMeCommand implements Command {
    public metadata: ApplicationCommandData = {
        name: 'register-me',
        description: 'Register your Infinite Flight Username',
        options: [
            {
                name: 'ifc-username',
                description: 'sup',
                type: ApplicationCommandOptionTypes.STRING

            }
        ]
    };
    public requireDev = false;
    public requireGuild = false;
    public deferType: CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];
    public requireUserPerms: PermissionString[] = [];

    private ifcUsername;

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
                Lang.getEmbed(
                    'validationEmbeds.registerMeuserHadFreshVerificationTicket',
                    data.lang(),
                    {
                        STALE_MINUTES: Config.modelConstants.verifyInfiniteFlightUserIdTicket.STALE_BY_MINUTES.toString(),
                    }
                )
            );
        }

        // check if the user specified an ifc username
        else if (this.ifcUsername == null) {
            await MessageUtils.sendIntr(
                commandInteraction,
                Lang.getEmbed(
                    'validationEmbeds.registerMeIFCUsernameNotSpecified',
                    data.lang()
                )
            );
        }
        else {
            const userHits = await infiniteFlightLive.userStats([], [], [this.ifcUsername]);

            // check if the ifc user exists
            if (userHits.length == 0) {
                await MessageUtils.sendIntr(
                    commandInteraction,
                    Lang.getEmbed(
                        'validationEmbeds.registerMeIFCUsernameNotFound',
                        data.lang(),
                        {
                            IFC_USERNAME: this.ifcUsername,
                        }
                    ),

                );
            }
            else {
                const userStats = userHits[0]
                const infiniteFlightUserAlreadyRegistered: boolean = await this.checkIfInfiniteFlightUserAlreadyRegistered(userStats.userId);

                // check if the infinite flight user has already been registered
                if (infiniteFlightUserAlreadyRegistered) {
                    await MessageUtils.sendIntr(
                        commandInteraction,
                        Lang.getEmbed(
                            'validationEmbeds.registerMeIFCUsernameTaken',
                            data.lang(),
                            {
                                IFC_USERNAME: this.ifcUsername,
                            }
                        )
                    );
                }
                else {
                    await prismaClient.user.upsert({
                        where: {
                            discordUserId: discordUser.id
                        },
                        update: {},
                        create: {
                            discordUserId: discordUser.id
                        },
                    });

                    const newVerifyInfiniteFlightUserIdTicket: VerifyInfiniteFlightUserIdTicket = await this.createVerifyInfiniteFlightUserIdTicket(
                        userStats.userId,
                        discordUser.id,
                        discordGuild.id,
                    );

                    MessageUtils.send(
                        discordUser,
                        Lang.getEmbed(
                            'registerMeEmbeds.dmInstructions',
                            data.lang(),
                            {
                                IFC_USERNAME: this.ifcUsername,
                                STALE_MINUTES: Config.modelConstants.verifyInfiniteFlightUserIdTicket.STALE_BY_MINUTES.toString(),

                                // We don't randomize these, but maybe in the future.
                                SERVER: 'Casual Server',
                                AIRPORT_ICAO: 'Any airport is fine, though my favorite airport is KSMF. But seriously, any airport will do.',

                                AIRCRAFT_NAME: newVerifyInfiniteFlightUserIdTicket.aircraftName,
                                LIVERY_NAME: newVerifyInfiniteFlightUserIdTicket.liveryName,
                                TRUE_HEADING: newVerifyInfiniteFlightUserIdTicket.heading.toString(),
                            }
                        )
                    )

                    await MessageUtils.sendIntr(
                        commandInteraction,
                        Lang.getEmbed(
                            'registerMeEmbeds.commandIntr',
                            data.lang(),
                            {
                                IFC_USERNAME: this.ifcUsername,
                            }
                        )
                    );
                }

            }
        }
    }

    private async createVerifyInfiniteFlightUserIdTicket(infiniteFlightUserId: string, discordUserId: string, discordGuildId: string): Promise<VerifyInfiniteFlightUserIdTicket> {
        const randomHeading: number = this.getRandomHeading();
        const randomAircraft: Aircraft = this.getRandomAircraft();
        const verifyInfiniteFlightUserIdTicket: VerifyInfiniteFlightUserIdTicket = await prismaClient.verifyInfiniteFlightUserIdTicket.create({
            data: {
                infiniteFlightUserId,
                discordUserId,
                discordGuildId,
                aircraftId: randomAircraft.aircraftId,
                aircraftName: randomAircraft.aircraftName,
                liveryId: randomAircraft.liveryId,
                liveryName: randomAircraft.liveryName,
                heading: randomHeading,
            }
        })
        return verifyInfiniteFlightUserIdTicket;
    }

    private getRandomHeading(): number {
        const randomHeading = Math.floor(Math.random() * 360) + 1;
        return randomHeading;
    }

    private getRandomAircraft(): Aircraft {
        const randomAircraft: Aircraft = InfiniteFlightPlanes[(Math.floor(Math.random() * InfiniteFlightPlanes.length))];
        return randomAircraft;
    }

    private async checkIfUserStillHasFreshVerificationTicket(discordUserId: string): Promise<boolean> {
        const freshTicketsCutoffDateTime: Date = VerifyInfiniteFlightUserIdTicketUtils.getFreshTicketsCutoffDateTime();

        const verificationTicket: VerifyInfiniteFlightUserIdTicket = await prismaClient.verifyInfiniteFlightUserIdTicket.findFirst({
            where: {
                discordUserId,
                created: {
                    gt: freshTicketsCutoffDateTime
                }
            }
        })
        return (verificationTicket !== null);
    }

    /**
     *
     * @param infiniteFlightUserId
     * @returns if Infinite Flight user is already registered
     */
    private async checkIfInfiniteFlightUserAlreadyRegistered(infiniteFlightUserId: string): Promise<boolean> {
        const user: User = await prismaClient.user.findUnique({
            where: {
                infiniteFlightUserId
            }
        });

        // return if user is not null
        return (user !== null);
    }



}
