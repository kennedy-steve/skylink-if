import { FlightEntry } from '../lib/infinite-flight-live/types';
import { User } from '.prisma/client';

export interface ActivePilotUser {
    user: User,
    flight: FlightEntry,
}