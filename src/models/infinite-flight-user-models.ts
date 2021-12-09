import { User } from ".prisma/client";
import { Airport, AtcEntry, FlightEntry } from "../lib/infinite-flight-live/types";

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