import * as satellite from 'satellite.js';
import { EciVec3, Geodetic } from 'satellite.js';

export interface SatelliteInfo {
    name: string;
    id: number;
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
    azimuth?: number;
    elevation?: number;
}

export interface PassPrediction {
    riseTime: Date;
    culminationTime: Date;
    setTime: Date;
    maxElevation: number;
    duration: number; // seconds
    passDirection: string; // compass direction at max elevation
}

// CelesTrak URLs


export const fetchTLE = async (catId: number = 25544): Promise<{ line1: string; line2: string; name: string }> => {
    // For simplicity, we fetch the stations file and find the satellite.
    // Or we can use the specific query for one satellite if CelesTrak supports it by CATNR.
    // gp.php?CATNR=25544&FORMAT=tle
    const url = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${catId}&FORMAT=tle`;

    // Note: CelesTrak has CORS enabled usually. If it fails, we might need a proxy, but prompt says "if CORS allows".
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch TLE');
        const text = await response.text();
        const lines = text.trim().split('\n');
        // TLE format:
        // Name
        // Line 1
        // Line 2
        if (lines.length >= 3) {
            return {
                name: lines[0].trim(),
                line1: lines[1].trim(),
                line2: lines[2].trim()
            };
        }
        throw new Error('Invalid TLE format');
    } catch (e) {
        console.error(e);
        // Fallback or rethrow
        throw e;
    }
};

export const propagateSatellite = (
    line1: string,
    line2: string,
    date: Date,
    observerLat?: number,
    observerLng?: number,
    observerAlt?: number // km
): SatelliteInfo | null => {
    const satrec = satellite.twoline2satrec(line1, line2);
    const positionAndVelocity = satellite.propagate(satrec, date);
    const positionEci = positionAndVelocity.position as EciVec3<number>;
    const velocityEci = positionAndVelocity.velocity as EciVec3<number>;

    if (!positionEci || !velocityEci) return null;

    const gmst = satellite.gstime(date);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

    let azimuth: number | undefined;
    let elevation: number | undefined;

    if (observerLat !== undefined && observerLng !== undefined) {
        const observerGd: Geodetic = {
            latitude: satellite.degreesToRadians(observerLat),
            longitude: satellite.degreesToRadians(observerLng),
            height: (observerAlt || 0)
        };
        const lookAngles = satellite.ecfToLookAngles(observerGd, satellite.eciToEcf(positionEci, gmst));
        azimuth = satellite.radiansToDegrees(lookAngles.azimuth);
        elevation = satellite.radiansToDegrees(lookAngles.elevation);
    }

    return {
        name: 'Satellite', // Placeholder, usually passed in
        id: satrec.satnum as unknown as number, // casting because types might differ
        latitude: satellite.radiansToDegrees(positionGd.latitude),
        longitude: satellite.radiansToDegrees(positionGd.longitude),
        altitude: positionGd.height, // km
        velocity: Math.sqrt(velocityEci.x ** 2 + velocityEci.y ** 2 + velocityEci.z ** 2),
        azimuth,
        elevation
    };
};

// Simple visual pass prediction (Next 24h)
// This is computationally intensive if done with high resolution.
// We step forward in time.
export const predictVisiblePasses = (
    line1: string,
    line2: string,
    observerLat: number,
    observerLng: number,
    startTime: Date = new Date(),
    durationHours: number = 24,
    minElevation: number = 10
): PassPrediction[] => {
    const passes: PassPrediction[] = [];
    const satrec = satellite.twoline2satrec(line1, line2);
    const observerGd: Geodetic = {
        latitude: satellite.degreesToRadians(observerLat),
        longitude: satellite.degreesToRadians(observerLng),
        height: 0
    };

    let t = new Date(startTime.getTime());
    const endTime = new Date(startTime.getTime() + durationHours * 3600 * 1000);


    let inPass = false;
    let currentPass: Partial<PassPrediction> = {};
    let maxEl = 0;

    // VERY naive implementation. Optimizations: coarse steps until elevation > 0, then fine steps.
    // For browser, we might want to do coarse search first.

    // Using a coarser step to find the pass window, then refine? 
    // Let's stick to 60s step for 'not visible' and 10s for 'visible' or simple 30s step.
    // ISS orbital period is ~90 mins. 

    while (t < endTime) {
        const positionAndVelocity = satellite.propagate(satrec, t);
        const positionEci = positionAndVelocity.position;

        if (positionEci && typeof positionEci !== 'boolean') {
            const gmst = satellite.gstime(t);
            const positionEcf = satellite.eciToEcf(positionEci as EciVec3<number>, gmst);
            const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);
            const elevation = satellite.radiansToDegrees(lookAngles.elevation);

            if (elevation > minElevation) {
                if (!inPass) {
                    inPass = true;
                    currentPass = {
                        riseTime: new Date(t),
                        maxElevation: elevation,
                        passDirection: getCompassDirection(satellite.radiansToDegrees(lookAngles.azimuth))
                    };
                    maxEl = elevation;
                } else {
                    if (elevation > maxEl) {
                        maxEl = elevation;
                        currentPass.maxElevation = maxEl;
                        currentPass.passDirection = getCompassDirection(satellite.radiansToDegrees(lookAngles.azimuth)); // Updates direction at max el
                        currentPass.culminationTime = new Date(t);
                    }
                }
            } else {
                if (inPass) {
                    inPass = false;
                    currentPass.setTime = new Date(t);
                    currentPass.duration = (currentPass.setTime.getTime() - currentPass.riseTime!.getTime()) / 1000;
                    // Only add if it's a valid completed pass
                    passes.push(currentPass as PassPrediction);
                }
            }
        }

        // Dynamic stepping?
        t = new Date(t.getTime() + (inPass ? 10 : 60) * 1000);
    }

    return passes;
};

function getCompassDirection(azimuth: number): string {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return dirs[Math.round(azimuth / 45) % 8];
}
