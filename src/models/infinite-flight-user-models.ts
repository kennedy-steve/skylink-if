import { Airport, AtcEntry, FlightEntry } from '../lib/infinite-flight-live/types.js';
import { User } from '.prisma/client/index.js';

export interface ActiveInfiniteFlightUser {
    user: User;
}

export interface ActivePilotUser extends ActiveInfiniteFlightUser {
    flight: FlightEntry;
    inboundAirport?: Airport;
    outboundAirport?: Airport;
}

export interface ActiveControllerUser extends ActiveInfiniteFlightUser {
    atcFacility: AtcEntry;
    airport: Airport;
}