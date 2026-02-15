declare module 'satellite.js' {
    export interface Geodetic {
        longitude: number;
        latitude: number;
        height: number;
    }

    export interface EciVec3<T> {
        x: T;
        y: T;
        z: T;
    }

    export function twoline2satrec(line1: string, line2: string): any;
    export function propagate(satrec: any, date: Date): { position: EciVec3<number> | boolean; velocity: EciVec3<number> | boolean };
    export function gstime(date: Date): number;
    export function eciToGeodetic(eci: EciVec3<number>, gmst: number): Geodetic;
    export function eciToEcf(eci: EciVec3<number>, gmst: number): EciVec3<number>;
    export function ecfToLookAngles(observerGeodetic: Geodetic, satelliteEcf: EciVec3<number>): { azimuth: number; elevation: number; rangeSat: number };
    export function degreesToRadians(degrees: number): number;
    export function radiansToDegrees(radians: number): number;
}
