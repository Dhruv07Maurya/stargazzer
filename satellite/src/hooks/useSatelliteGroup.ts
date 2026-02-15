import { useState, useEffect } from 'react';
import * as satellite from 'satellite.js';
import { degreesLat, degreesLong } from '../utils/satelliteUtils';
import { SatelliteData, SatelliteGroupType } from '../data/satellites';

export interface SatellitePosition {
    id: string;
    lat: number;
    lng: number;
    alt: number;
    velocity: number;
    group: SatelliteGroupType;
}

export interface SatellitePath {
    lat: number;
    lng: number;
    alt: number;
}

export const useSatelliteGroup = (satellites: SatelliteData[]) => {
    const [positions, setPositions] = useState<SatellitePosition[]>([]);

    useEffect(() => {
        const satrecs = satellites.map(sat => ({
            id: sat.id,
            group: sat.group,
            rec: satellite.twoline2satrec(sat.tle1, sat.tle2)
        }));

        const updatePositions = () => {
            const now = new Date();
            const gmst = satellite.gstime(now);

            const newPositions = satrecs.map(sat => {
                const positionAndVelocity = satellite.propagate(sat.rec, now);
                const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
                const velocityEci = positionAndVelocity.velocity as satellite.EciVec3<number>;

                if (!positionEci || !velocityEci) return null;

                const positionGd = satellite.eciToGeodetic(positionEci, gmst);

                return {
                    id: sat.id,
                    group: sat.group,
                    lat: degreesLat(positionGd.latitude),
                    lng: degreesLong(positionGd.longitude),
                    alt: positionGd.height,
                    velocity: Math.sqrt(
                        Math.pow(velocityEci.x, 2) +
                        Math.pow(velocityEci.y, 2) +
                        Math.pow(velocityEci.z, 2)
                    )
                };
            }).filter((pos): pos is SatellitePosition => pos !== null);

            setPositions(newPositions);
        };

        const interval = setInterval(updatePositions, 1000);
        updatePositions();

        return () => clearInterval(interval);
    }, [satellites]);

    // Function to calculate future path for a specific satellite
    const getPath = (satelliteId: string, durationMinutes: number = 90): SatellitePath[] => {
        const sat = satellites.find(s => s.id === satelliteId);
        if (!sat) return [];

        const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
        const path: SatellitePath[] = [];
        const now = new Date();

        for (let i = 0; i <= durationMinutes; i++) {
            const futureDate = new Date(now.getTime() + i * 60000);
            const gmst = satellite.gstime(futureDate);
            const positionAndVelocity = satellite.propagate(satrec, futureDate);
            const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;

            if (positionEci) {
                const positionGd = satellite.eciToGeodetic(positionEci, gmst);
                path.push({
                    lat: degreesLat(positionGd.latitude),
                    lng: degreesLong(positionGd.longitude),
                    alt: positionGd.height
                });
            }
        }
        return path;
    };

    return { positions, getPath };
};
