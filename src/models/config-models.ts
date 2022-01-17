import { PartialTypes, ShardingManagerMode } from 'discord.js';

export interface BotSite {
    name: string;
    enabled: boolean;
    url: string;
    authorization: string;
    body: string;
}

export interface BaseConfig {
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
            AMOUNT: number;
            INTERVAL: number;
        }
        triggers: {
            AMOUNT: number;
            INTERVAL: number;
        }
        reactions: {
            AMOUNT: number;
            INTERVAL: number;
        },
        buttons: {
            AMOUNT: number;
            INTERVAL: number;
        },
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

    development: {
        dummyMode: {
            ENABLED: boolean;
            WHITE_LIST: string[];
        }

        CHECK_PERMS: boolean;

        shardMode: {
            ENABLED: boolean;
            VALUE: ShardingManagerMode;
        }
    }

    BOT_SITES: BotSite[];
}