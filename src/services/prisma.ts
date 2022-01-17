import { PrismaClient } from '.prisma/client/index.js';
import dotenv from 'dotenv';
import { Logger } from './index.js';

dotenv.config();
declare global {
    var prismaClient: PrismaClient | undefined;
}

if (global.prismaClient === undefined) {
    Logger.info(`Creating new PrismaClient`);
}
else {
    Logger.info(`Reusing existing PrismaClient`);
}

const prismaClient = global.prismaClient || new PrismaClient({
    log: ['error', 'info', 'warn'],
});

global.prismaClient = prismaClient;

export {
    prismaClient,
}
