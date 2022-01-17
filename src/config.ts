import { Constants, PartialTypes, ShardingManager, ShardingManagerMode } from 'discord.js';
import dotenv from 'dotenv';
import { BaseConfig } from './models/config-models.js';

dotenv.config();

const Config: BaseConfig = {
    client: {
        ID: process.env.CLIENT_ID,
        TOKEN: process.env.CLIENT_TOKEN,
        INTENTS: [
            'GUILDS',
            'GUILD_MESSAGES',
            'GUILD_MESSAGE_REACTIONS',
            'DIRECT_MESSAGES',
            'DIRECT_MESSAGE_REACTIONS',
        ],
        PARTIALS: [
            Constants.PartialTypes.MESSAGE,
            Constants.PartialTypes.CHANNEL,
            Constants.PartialTypes.REACTION,
        ],
        CACHES: {
            BaseGuildEmojiManager: 0,
            GuildBanManager: 0,
            GuildInviteManager: 0,
            GuildStickerManager: 0,
            MessageManager: 0,
            PresenceManager: 0,
            StageInstanceManager: 0,
            ThreadManager: 0,
            ThreadMemberManager: 0,
            VoiceStateManager: 0,
        },
    },

    DEVELOPERS: process.env.DEVELOPERS ? process.env.DEVELOPERS.split(',') : [],

    infiniteFlight: {
        API_KEY: process.env.INFINITE_FLIGHT_API_KEY,
    },

    api: {
        PORT: parseInt(process.env.API_PORT) || 8080,
        SECRET: process.env.API_SECRET || '00000000-0000-0000-0000-000000000000',
    },

    sharding: {
        SPAWN_DELAY: parseInt(process.env.SPAWN_DELAY) || 5,
        SPAWN_TIMEOUT: parseInt(process.env.SPAWN_TIMEOUT) || 300,
        SERVERS_PER_SHARD: parseInt(process.env.SERVERS_PER_SHARD) || 1000,
    },

    clustering: {
        // False by default
        ENABLED: process.env.CLUSTERING_ENABLED === 'true',
        SHARD_COUNT: parseInt(process.env.SHARD_COUNT) || 16,
        CALLBACK_URL: process.env.CALLBACK_URL || 'http://localhost:8080/',
        masterApi: {
            URL: process.env.MASTER_API_URL || 'http://localhost:5000/',
            TOKEN: process.env.MASTER_API_TOKEN || '00000000-0000-0000-0000-000000000000',
        },
    },

    jobs: {
        updateServerCount: {
            // Every 10 minutes by default
            SCHEDULE: process.env.UPDATE_SERVER_COUNT_SCHEDULE || '0 */10 * * * *',

            // True by default -- we want to log the job
            LOG: (process.env.UPDATE_SERVER_COUNT_LOG || 'true') === 'true',
        },
        notifyActiveInfiniteFlightUsers: {
            // Every minute by default
            SCHEDULE: process.env.NOTIFY_ACTIVE_INFINITE_FLIGHT_USERS_SCHEDULE || '0 */1 * * * *',

            // True by default -- we want to log this job
            LOG: (process.env.NOTIFY_ACTIVE_INFINITE_FLIGHT_USERS_LOG || 'true') === 'true',
        },
    },

    rateLimiting: {
        commands: {
            AMOUNT: parseInt(process.env.COMMANDS_AMOUNT) || 10,
            INTERVAL: parseInt(process.env.COMMANDS_INTERVAL) || 30,
        },
        triggers: {
            AMOUNT: parseInt(process.env.TRIGGERS_AMOUNT) || 10,
            INTERVAL: parseInt(process.env.TRIGGERS_INTERVAL) || 30,
        },
        reactions: {
            AMOUNT: parseInt(process.env.REACTIONS_AMOUNT) || 10,
            INTERVAL: parseInt(process.env.REACTIONS_INTERVAL) || 30,
        },
        buttons: {
            AMOUNT: parseInt(process.env.BUTTONS_AMOUNT) || 10,
            INTERVAL: parseInt(process.env.BUTTONS_INTERVAL) || 30,
        },
    },

    logging: {
        // True by default -- pretty is good for debugging
        PRETTY: (process.env.LOGGING_PRETTY || 'true') === 'true',
        rateLimit: {
            MIN_TIMEOUT: parseInt(process.env.LOGGING_RATELIMIT_MIN_TIMEOUT) || 30,
        },
    },

    modelConstants: {
        verifyInfiniteFlightUserIdTicket: {
            STALE_BY_MINUTES:
                parseInt(process.env.VERIFY_INFINITE_FLIGHT_USER_ID_TICKET_STALE_BY_MINUTES) || 15,
        },
    },

    development: {
        dummyMode: {
            // False by default
            ENABLED: process.env.DUMMY_MODE_ENABLED === 'true',
            WHITE_LIST: process.env.DUMMY_MODE_WHITE_LIST
                ? process.env.DUMMY_MODE_WHITE_LIST.split(',')
                : [],
        },

        // True by default -- it's good to make sure check permissions is working
        CHECK_PERMS: (process.env.CHECK_PERMS || 'true') === 'true',

        shardMode: {
            // False by default
            ENABLED: process.env.SHARD_MODE_ENABLED === 'true',

            // Process by default
            VALUE: (process.env.SHARD_MODE_VALUE || 'process') as ShardingManagerMode,
        },
    },

    BOT_SITES: [
        {
            name: 'top.gg',
            enabled: process.env.TOPGG_ENABLED === 'true',
            url: `https://top.gg/bot/${process.env.CLIENT_ID}`,
            authorization: process.env.TOPGG_TOKEN,
            body: '{"server_count":{{SERVER_COUNT}}}',
        },
    ],
};

export { Config };
