import fetch from 'node-fetch';

import {
    UserGradeInfo,
    SessionInfo,
    FlightEntry,
    AtcEntry,
    UserStats,
    ApiResponse,
    ErrorCode,
    AirportStatus,
    OceanicTrack,
    InfiniteFlightSession,
    InfiniteFlightStatus,
} from './types';

let Config = require('../../../config/config.json');

const test = 2;

const IF_API_KEY = Config.infiniteFlight.apiKey;
const URLBASE = 'https://api.infiniteflight.com/public/v2';

export async function getSessionInfos(): Promise<SessionInfo[]> {
    const req = await fetch(`${URLBASE}/sessions`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<SessionInfo[]> = await req.json();
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                response.errorCode
            )
        );
    }

    return response.result;
}

export async function getFlights(sessionID: string): Promise<FlightEntry[]> {
    const req = await fetch(
        `${URLBASE}/flights/${encodeURIComponent(sessionID)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
    const response: ApiResponse<FlightEntry[]> = await req.json();
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                response.errorCode
            )
        );
    }

    return response.result;
}

export async function atc(sessionID: string): Promise<AtcEntry[]> {
    const req = await fetch(`${URLBASE}/atc/${encodeURIComponent(sessionID)}`, {
        headers: {
            Authorization: `Bearer ${IF_API_KEY}`,
        },
    });
    const response: ApiResponse<AtcEntry[]> = await req.json();
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                response.errorCode
            )
        );
    }

    return response.result;
}

export async function gradeTable(userId: string): Promise<UserGradeInfo> {
    const req = await fetch(
        `${URLBASE}/user/grade/${encodeURIComponent(userId)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
    const response: ApiResponse<UserGradeInfo> = await req.json();
    if (response.errorCode != 0) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                response.errorCode
            )
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
    const response: ApiResponse<UserStats[]> = await req.json();
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                response.errorCode
            )
        );
    }

    return response.result;
}

export async function atis(
    airportIcao: string,
    sessionID: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<string> {
    const req = await fetch(
        `${URLBASE}/atis/${encodeURIComponent(
            airportIcao
        )}/${encodeURIComponent(sessionID)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
    const response: ApiResponse<string> = await req.json();
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                response.errorCode
            )
        );
    }

    return response.result;
}

export async function airportStatus(
    icao: string,
    sessionID: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<AirportStatus> {
    const req = await fetch(
        `${URLBASE}/airport/${encodeURIComponent(
            icao
        )}/status/${encodeURIComponent(sessionID)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
    const response: ApiResponse<AirportStatus> = await req.json();
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                response.errorCode
            )
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
    const response: ApiResponse<OceanicTrack[]> = await req.json();
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                response.errorCode
            )
        );
    }

    return response.result;
}


export async function getWorldStatus(
    sessionID: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<AirportStatus[]> {
    const req = await fetch(
        `${URLBASE}/world/status/${encodeURIComponent(sessionID)}`,
        {
            headers: {
                Authorization: `Bearer ${IF_API_KEY}`,
            },
        }
    );
    const response: ApiResponse<AirportStatus[]> = await req.json();
    if (response.errorCode != ErrorCode.Ok) {
        await Promise.reject(
            new Error(
                'Invalid API Response Code. Expected 0, received ' +
                response.errorCode
            )
        );
    }

    return response.result;
}


async function getInfiniteFlightSession(
    sessionID: string = '7e5dcd44-1fb5-49cc-bc2c-a9aab1f6a856'
): Promise<InfiniteFlightSession> {
    const airports = await getWorldStatus(sessionID);
    const flights = await getFlights(sessionID);
    const atcFacilities = [];

    for (var airportStatus of airports) {
        for (var atcEntry of airportStatus.atcFacilities) {
            atcFacilities.push(atcEntry);
        }
    }
    const infiniteFlightSession: InfiniteFlightSession = {
        sessionInfo: null,
        flights: flights,
        airports: airports,
        atcFacilities: atcFacilities,
    }
    return infiniteFlightSession;
}

export async function getInfiniteFlightStatus(): Promise<InfiniteFlightStatus> {
    const sessionInfos = await getSessionInfos();
    const infiniteFlightSessions = [];

    for (var sessionInfo of sessionInfos) {
        var sessionID = sessionInfo.id;
        var infiniteFlightSession = await getInfiniteFlightSession(sessionID);
        infiniteFlightSession.sessionInfo = sessionInfo;
        infiniteFlightSessions.push(infiniteFlightSession);
    }
    const infiniteFlightStatus: InfiniteFlightStatus = {
        sessions: infiniteFlightSessions,
    }
    return infiniteFlightStatus;
}