import { ShardingManager } from 'discord.js';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';
import { createRequire } from 'node:module';
import { Config } from '../config.js';
import { GetGuildsResponse } from '../models/cluster-api/index.js';
import { Controller } from './index.js';

const require = createRequire(import.meta.url);

export class GuildsController implements Controller {
    public path = '/guilds';
    public router: Router = router();
    public authToken: string = Config.api.SECRET;

    constructor(private shardManager: ShardingManager) { }

    public register(): void {
        this.router.get('/', (req, res) => this.getGuilds(req, res));
    }

    private async getGuilds(req: Request, res: Response): Promise<void> {
        let guilds: string[] = [
            ...new Set(
                (
                    await this.shardManager.broadcastEval(client => [...client.guilds.cache.keys()])
                ).flat()
            ),
        ];

        let resBody: GetGuildsResponse = {
            guilds,
        };
        res.status(200).json(resBody);
    }
}
