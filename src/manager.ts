import { Shard, ShardingManager } from 'discord.js';
import { createRequire } from 'node:module';
import { Config } from './config.js';
import { JobService, Logger } from './services/index.js';

const require = createRequire(import.meta.url);
let Logs = require('../lang/logs.json');

export class Manager {
    constructor(private shardManager: ShardingManager, private jobService: JobService) { }

    public async start(): Promise<void> {
        this.registerListeners();

        let shardList = this.shardManager.shardList as number[];

        try {
            Logger.info(
                Logs.info.managerSpawningShards
                    .replaceAll('{SHARD_COUNT}', shardList.length.toLocaleString())
                    .replaceAll('{SHARD_LIST}', shardList.join(', '))
            );
            await this.shardManager.spawn({
                amount: this.shardManager.totalShards,
                delay: Config.sharding.SPAWN_DELAY * 1000,
                timeout: Config.sharding.SPAWN_TIMEOUT * 1000,
            });
            Logger.info(Logs.info.managerAllShardsSpawned);
        } catch (error) {
            Logger.error(Logs.error.managerSpawningShards, error);
            return;
        }

        if (Config.development.dummyMode.ENABLED) {
            return;
        }

        this.jobService.start();
    }

    private registerListeners(): void {
        this.shardManager.on('shardCreate', shard => this.onShardCreate(shard));
    }

    private onShardCreate(shard: Shard): void {
        Logger.info(Logs.info.managerLaunchedShard.replaceAll('{SHARD_ID}', shard.id.toString()));
    }
}
