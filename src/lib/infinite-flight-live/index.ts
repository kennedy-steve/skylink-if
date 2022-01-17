import fetch from 'node-fetch';
import { Config } from '../../config.js';
import {
    AirportStatus,
    ApiResponse,
    AtcEntry,
    ErrorCode,
    FlightEntry,
    InfiniteFlightSession,
    InfiniteFlightStatus,
    OceanicTrack,
    SessionInfo,
    UserGradeInfo,
    UserStats,
} from './types.js';

const test = 2;

const IF_API_KEY = Config.infiniteFlight.API_KEY;
const URLBASE = 'https://api.infiniteflight.com/public/v2';

export async function getSessionInfos(): Promise<SessionInfo[]> {
    const req = await fetch(`${URLBASE}/sessions`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<SessionInfo[]> = (await req.json()) as ApiResponse<SessionInfo[]>;
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error('Invalid API Response Code. Expected 0, received ' + response.errorCode)
        );
    }

    return response.result;
}

export async function getFlights(sessionId: string): Promise<FlightEntry[]> {
    const req = await fetch(`${URLBASE}/flights/${encodeURIComponent(sessionId)}`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<FlightEntry[]> = (await req.json()) as ApiResponse<FlightEntry[]>;
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error('Invalid API Response Code. Expected 0, received ' + response.errorCode)
        );
    }

    return response.result;
}

export async function atc(sessionId: string): Promise<AtcEntry[]> {
    const req = await fetch(`${URLBASE}/atc/${encodeURIComponent(sessionId)}`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<AtcEntry[]> = (await req.json()) as ApiResponse<AtcEntry[]>;
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error('Invalid API Response Code. Expected 0, received ' + response.errorCode)
        );
    }

    return response.result;
}

export async function gradeTable(userId: string): Promise<UserGradeInfo> {
    const req = await fetch(`${URLBASE}/user/grade/${encodeURIComponent(userId)}`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<UserGradeInfo> = (await req.json()) as ApiResponse<UserGradeInfo>;
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error('Invalid API Response Code. Expected 0, received ' + response.errorCode)
        );
    }

    return response.result;
}

export async function userStats(
    userIds: string[] = [],
    userHashes: string[] = [],
    discourseNames: string[] = []
): Promise<UserStats[]> {
    let rbody: { [key: string]: string[] } = {};
    if (userIds.length > 0) {
        rbody.userIds = userIds;
    }
    if (userHashes.length > 0) {
        rbody.userHashes = userHashes;
    }
    if (discourseNames.length > 0) {
        rbody.discourseNames = discourseNames;
    }

    const req = await fetch(`${URLBASE}/user/stats`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(rbody),
    });
    const response: ApiResponse<UserStats[]> = (await req.json()) as ApiResponse<UserStats[]>;
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error('Invalid API Response Code. Expected 0, received ' + response.errorCode)
        );
    }

    return response.result;
}

export async function atis(
    airportIcao: string,
    sessionId: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<string> {
    const req = await fetch(
        `${URLBASE}/atis/${encodeURIComponent(airportIcao)}/${encodeURIComponent(sessionId)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
    const response: ApiResponse<string> = (await req.json()) as ApiResponse<string>;
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error('Invalid API Response Code. Expected 0, received ' + response.errorCode)
        );
    }

    return response.result;
}

export async function airportStatus(
    icao: string,
    sessionId: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<AirportStatus> {
    const req = await fetch(
        `${URLBASE}/airport/${encodeURIComponent(icao)}/status/${encodeURIComponent(sessionId)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
    const response: ApiResponse<AirportStatus> = (await req.json()) as ApiResponse<AirportStatus>;
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error('Invalid API Response Code. Expected 0, received ' + response.errorCode)
        );
    }

    return response.result;
}

export async function oceanicTracks(): Promise<OceanicTrack[]> {
    const req = await fetch(`${URLBASE}/tracks`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<OceanicTrack[]> = (await req.json()) as ApiResponse<OceanicTrack[]>;
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error('Invalid API Response Code. Expected 0, received ' + response.errorCode)
        );
    }

    return response.result;
}

export async function getWorldStatus(
    sessionId: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<AirportStatus[]> {
    const req = await fetch(`${URLBASE}/world/status/${encodeURIComponent(sessionId)}`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<AirportStatus[]> = (await req.json()) as ApiResponse<
        AirportStatus[]
    >;
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error('Invalid API Response Code. Expected 0, received ' + response.errorCode)
        );
    }

    return response.result;
}

async function getInfiniteFlightSession(
    sessionId: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<InfiniteFlightSession> {
    const airports = await getWorldStatus(sessionId);
    const flights = await getFlights(sessionId);
    const atcFacilities = [];

    for (let airportStatus of airports) {
        for (let atcEntry of airportStatus.atcFacilities) {
            atcFacilities.push(atcEntry);
        }
    }
    const infiniteFlightSession: InfiniteFlightSession = {
        sessionInfo: null,
        flights,
        airportStatuses: airports,
        atcFacilities,
    };
    return infiniteFlightSession;
}

export async function getInfiniteFlightStatus(): Promise<InfiniteFlightStatus> {
    const sessionInfos = await getSessionInfos();
    const infiniteFlightSessions = [];

    for (let sessionInfo of sessionInfos) {
        let sessionId = sessionInfo.id;
        let infiniteFlightSession = await getInfiniteFlightSession(sessionId);
        infiniteFlightSession.sessionInfo = sessionInfo;
        infiniteFlightSessions.push(infiniteFlightSession);
    }
    const infiniteFlightStatus: InfiniteFlightStatus = {
        sessions: infiniteFlightSessions,
    };
    return infiniteFlightStatus;
}
