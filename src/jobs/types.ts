import { User } from ".prisma/client";
import { FlightEntry } from "../lib/infinite-flight-live/types";

export interface ActivePilotUser {
    user: User,
    flight: FlightEntry,
}