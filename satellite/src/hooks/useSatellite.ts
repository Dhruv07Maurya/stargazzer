import { useState, useEffect } from 'react';
import * as satellite from 'satellite.js';
import { degreesLat, degreesLong } from '../utils/satelliteUtils';

interface SatellitePosition {
    lat: number;
    lng: number;
    alt: number;
    velocity: number;
}

// Sample ISS TLE (Two-Line Element)
const ISS_TLE = [
    '1 25544U 98067A   23248.54842295  .00018164  00000-0  32729-3 0  9993',
    '2 25544  51.6416 357.6536 0005404 227.8174 205.8236 15.50066264424355'
];

export const useSatellite = () => {
    const [position, setPosition] = useState<SatellitePosition | null>(null);

    useEffect(() => {
        const satrec = satellite.twoline2satrec(ISS_TLE[0], ISS_TLE[1]);

        const updatePosition = () => {
            const now = new Date();
            const positionAndVelocity = satellite.propagate(satrec, now);
            const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
            const velocityEci = positionAndVelocity.velocity as satellite.EciVec3<number>;

            if (positionEci && velocityEci) {
                const gmst = satellite.gstime(now);
                const positionGd = satellite.eciToGeodetic(positionEci, gmst);

                // Conversions
                const lat = degreesLat(positionGd.latitude);
                const lng = degreesLong(positionGd.longitude);
                const alt = positionGd.height; // in km
                const velocity = Math.sqrt(
                    Math.pow(velocityEci.x, 2) +
                    Math.pow(velocityEci.y, 2) +
                    Math.pow(velocityEci.z, 2)
                );

                setPosition({ lat, lng, alt, velocity });
            }
        };

        const interval = setInterval(updatePosition, 1000);
        updatePosition(); // Initial call

        return () => clearInterval(interval);
    }, []);

    return position;
};
