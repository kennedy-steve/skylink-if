import { createRequire } from 'node:module';
import { URL } from 'node:url';
import { Config } from '../config.js';
import {
    LoginClusterResponse,
    RegisterClusterRequest,
    RegisterClusterResponse,
} from '../models/master-api/index.js';
import { HttpService } from './index.js';

const require = createRequire(import.meta.url);

export class MasterApiService {
    private clusterId: string;

    constructor(private httpService: HttpService) { }

    public async register(): Promise<void> {
        let reqBody: RegisterClusterRequest = {
            shardCount: Config.clustering.SHARD_COUNT,
            callback: {
                url: Config.clustering.CALLBACK_URL,
                token: Config.api.SECRET,
            },
        };

        let res = await this.httpService.post(
            new URL('/clusters', Config.clustering.masterApi.URL),
            Config.clustering.masterApi.TOKEN,
            reqBody
        );

        if (!res.ok) {
            throw res;
        }

        let resBody = (await res.json()) as RegisterClusterResponse;
        this.clusterId = resBody.id;
    }

    public async login(): Promise<LoginClusterResponse> {
        let res = await this.httpService.put(
            new URL(`/clusters/${this.clusterId}/login`, Config.clustering.masterApi.URL),
            Config.clustering.masterApi.TOKEN
        );

        if (!res.ok) {
            throw res;
        }

        return (await res.json()) as LoginClusterResponse;
    }

    public async ready(): Promise<void> {
        let res = await this.httpService.put(
            new URL(`/clusters/${this.clusterId}/ready`, Config.clustering.masterApi.URL),
            Config.clustering.masterApi.TOKEN
        );

        if (!res.ok) {
            throw res;
        }
    }
}
