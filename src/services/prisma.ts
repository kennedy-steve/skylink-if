import { PrismaClient } from '@prisma/client';
import { Logger } from '.';

require('dotenv').config();
declare global {
    var prismaClient: PrismaClient | undefined;
}

if (global.prismaClient === undefined) {
    Logger.info(`Creating new PrismaClient`);
} else {
    Logger.info(`Reusing existing PrismaClient`);
}

export const prismaClient =
    global.prismaClient ||
    new PrismaClient({
        log: ['error', 'info', 'warn'],
    });

global.prismaClient = prismaClient;
