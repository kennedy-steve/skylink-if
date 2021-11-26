import { VerifyInfiniteFlightUserIDTicket } from "@prisma/client";
import { FlightEntry } from "../lib/infinite-flight-live/types";
import { Logger } from "../services";

let Config = require('../../config/config.json');

export class VerifyInfiniteFlightUserIDTicketUtils {
    public static getFreshTicketsCutoffDateTime(): Date {
        const currentDateTime: Date = new Date();
        const millisecondsPerMinute: number = 60000
        const staleByMilliseconds: number = Config.modelConstants.verifyInfiniteFlightUserIDTicket.staleByMinutes * millisecondsPerMinute;
        const freshTicketsDateTime: Date = new Date(currentDateTime.getTime() - staleByMilliseconds);

        return freshTicketsDateTime;
    }

    public static checkIfFlightPassesAllChecks(flight: FlightEntry, ticket: VerifyInfiniteFlightUserIDTicket): boolean {
        const flightPassesAllChecks: boolean = (
            this.checkHeading(flight, ticket)
            && this.checkAircraft(flight, ticket)
            && this.checkLivery(flight, ticket)
        );
        return flightPassesAllChecks;
    }

    /**
     * 
     * @param flight 
     * @param ticket 
     * @returns boolean if the heading delta is within the threshold
     */
    private static checkHeading(flight: FlightEntry, ticket: VerifyInfiniteFlightUserIDTicket): boolean {
        const correctHeadingDeltaThreshold = 3.5;
        const headingDelta = Math.abs(flight.heading - ticket.heading);
        const isHeadingCorrect = (headingDelta < correctHeadingDeltaThreshold);
        if (!isHeadingCorrect) {
            Logger.info(`Verification of ticket ${ticket.id} failed. Heading is off by ${headingDelta} degrees`);
        }
        return isHeadingCorrect;
    }

    /**
     * 
     * @param flight 
     * @param ticket 
     * @returns if the aircrafts match
     */
    private static checkAircraft(flight: FlightEntry, ticket: VerifyInfiniteFlightUserIDTicket): boolean {
        const isAircraftCorrect = (flight.aircraftId == ticket.aircraftID);
        return isAircraftCorrect;
    }

    /**
     * 
     * @param flight 
     * @param ticket 
     * @returns if the liveries match
     */
    private static checkLivery(flight: FlightEntry, ticket: VerifyInfiniteFlightUserIDTicket): boolean {
        const isLiveryCorrect = (flight.liveryId == ticket.liveryID);
        return isLiveryCorrect;
    }
}