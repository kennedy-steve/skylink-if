import { Constants, PartialTypes } from "discord.js";

interface BaseConfig {
    client: {
        ID: string;
        TOKEN: string;
        INTENTS: any[];
        PARTIALS: PartialTypes[];
        CACHES: {
            [key: string]: number
        }
    }

    DEVELOPERS: string[];

    infiniteFlight: {
        API_KEY: string;
    }

    api: {
        PORT: number;
        SECRET: string;
    }

    sharding: {
        SPAWN_DELAY: number;
        SPAWN_TIMEOUT: number;
        SERVERS_PER_SHARD: number;
    }

    clustering: {
        ENABLED: boolean;
        SHARD_COUNT: number;
        CALLBACK_URL: string;
        masterApi: {
            URL: string;
            TOKEN: string;
        }
    }

    jobs: {
        updateServerCount: {
            SCHEDULE: string;
            LOG: boolean;
        }
        notifyActiveInfiniteFlightUsers: {
            SCHEDULE: string;
            LOG: boolean;
        }
    }

    rateLimiting: {
        commands: {
            amount: number;
            interval: number;
        }
        triggers: {
            amount: number;
            interval: number;
        }
        reactions: {
            amount: number;
            interval: number;
        }
    }

    logging: {
        PRETTY: boolean;
        rateLimit: {
            MIN_TIMEOUT: number;
        }
    }

    modelConstants: {
        verifyInfiniteFlightUserIdTicket: {
            STALE_BY_MINUTES: number;
        }
    }
}

export const Config: BaseConfig = {
    client: {
        ID: process.env.CLIENT_ID,
        TOKEN: process.env.CLIENT_TOKEN,
        INTENTS: [
            "GUILDS",
            "GUILD_MESSAGES",
            "GUILD_MESSAGE_REACTIONS",
            "DIRECT_MESSAGES",
            "DIRECT_MESSAGE_REACTIONS"
        ],
        PARTIALS: [
            Constants.PartialTypes.MESSAGE,
            Constants.PartialTypes.CHANNEL,
            Constants.PartialTypes.REACTION,
        ],
        CACHES: {
            "BaseGuildEmojiManager": 0,
            "GuildBanManager": 0,
            "GuildInviteManager": 0,
            "GuildStickerManager": 0,
            "MessageManager": 0,
            "PresenceManager": 0,
            "StageInstanceManager": 0,
            "ThreadManager": 0,
            "ThreadMemberManager": 0,
            "VoiceStateManager": 0,
        },
    },

    DEVELOPERS: [
        process.env.OWNER_DISCORD_ID,
    ],

    infiniteFlight: {
        API_KEY: process.env.INFINITE_FLIGHT_API_KEY,
    },

    api: {
        PORT: parseInt(process.env.API_PORT) || 8080,
        SECRET: process.env.API_SECRET || "00000000-0000-0000-0000-000000000000",
    },

    sharding: {
        SPAWN_DELAY: parseInt(process.env.SPAWN_DELAY) || 5,
        SPAWN_TIMEOUT: parseInt(process.env.SPAWN_TIMEOUT) || 300,
        SERVERS_PER_SHARD: parseInt(process.env.SERVERS_PER_SHARD) || 1000,
    },

    clustering: {
        ENABLED: process.env.CLUSTERING_ENABLED === "true",
        SHARD_COUNT: parseInt(process.env.SHARD_COUNT) || 16,
        CALLBACK_URL: process.env.CALLBACK_URL || "http://localhost:8080/",
        masterApi: {
            URL: process.env.MASTER_API_URL || "http://localhost:5000/",
            TOKEN: process.env.MASTER_API_TOKEN || "00000000-0000-0000-0000-000000000000",
        },
    },

    jobs: {
        updateServerCount: {
            SCHEDULE: process.env.UPDATE_SERVER_COUNT_SCHEDULE || "0 */10 * * * *",
            LOG: process.env.UPDATE_SERVER_COUNT_LOG === "true",
        },
        notifyActiveInfiniteFlightUsers: {
            SCHEDULE: process.env.NOTIFY_ACTIVE_INFINITE_FLIGHT_USERS_SCHEDULE || "0 */1 * * * *",
            LOG: process.env.NOTIFY_ACTIVE_INFINITE_FLIGHT_USERS_LOG === "true",
        },
    },

    rateLimiting: {
        commands: {
            amount: parseInt(process.env.COMMANDS_AMOUNT) || 10,
            interval: parseInt(process.env.COMMANDS_INTERVAL) || 30,
        },
        triggers: {
            amount: parseInt(process.env.TRIGGERS_AMOUNT) || 10,
            interval: parseInt(process.env.TRIGGERS_INTERVAL) || 30,
        },
        reactions: {
            amount: parseInt(process.env.REACTIONS_AMOUNT) || 10,
            interval: parseInt(process.env.REACTIONS_INTERVAL) || 30,
        },
    },

    logging: {
        PRETTY: process.env.LOGGING_PRETTY === "true",
        rateLimit: {
            MIN_TIMEOUT: parseInt(process.env.LOGGING_RATELIMIT_MIN_TIMEOUT) || 30,
        },
    },

    modelConstants: {
        verifyInfiniteFlightUserIdTicket: {
            STALE_BY_MINUTES: parseInt(process.env.VERIFY_INFINITE_FLIGHT_USER_ID_TICKET_STALE_BY_MINUTES) || 15,
        },
    },
};