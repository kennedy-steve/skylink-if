import { Logger } from '../services';

let InfiniteFlightPlanes = require('../../infinite-flight-data/aircraft-and-liveries-list.json');

let fs = require('fs');

export class AircraftUtils {
    public static generateAircraftNamesJson(): void {
        const aircraft = {};

        for (let i in InfiniteFlightPlanes) {
            let plane = InfiniteFlightPlanes[i];
            aircraft[plane.aircraftId] = plane.aircraftName;
        }

        const aircraftJson: string = JSON.stringify(aircraft);

        Logger.info(`Writing aircraft.json to disk... ${aircraftJson}`);

        fs.writeFile('./infinite-flight-data/aircraft-names.json', aircraftJson, function (err) {
            if (err) throw err;
        });
    }

    public static generateLiveryNamesJson(): void {
        const liveries = {};

        for (let i in InfiniteFlightPlanes) {
            let plane = InfiniteFlightPlanes[i];
            liveries[plane.liveryId] = plane.liveryName;
        }

        const liveriesJson: string = JSON.stringify(liveries);

        Logger.info(`Writing liveries.json to disk... ${liveriesJson}`);

        fs.writeFile('./infinite-flight-data/livery-names.json', liveriesJson, function (err) {
            if (err) throw err;
        });
    }
}
