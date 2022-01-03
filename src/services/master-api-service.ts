import { URL } from 'url';

import { HttpService } from '.';
import {
    LoginClusterResponse,
    RegisterClusterRequest,
    RegisterClusterResponse,
} from '../models/master-api';
import { Config } from '../config';

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

        let resBody: RegisterClusterResponse = await res.json();
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

        return res.json();
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
