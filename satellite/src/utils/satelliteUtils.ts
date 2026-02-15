/**
 * Converts radians to degrees for latitude.
 * @param radians Latitude in radians
 * @returns Latitude in degrees (-90 to 90)
 */
export const degreesLat = (radians: number): number => {
    return radians * (180 / Math.PI);
};

/**
 * Converts radians to degrees for longitude.
 * Normalizes to -180 to 180 range.
 * @param radians Longitude in radians
 * @returns Longitude in degrees (-180 to 180)
 */
export const degreesLong = (radians: number): number => {
    let degrees = radians * (180 / Math.PI);

    // Normalize to -180 to 180
    while (degrees <= -180) degrees += 360;
    while (degrees > 180) degrees -= 360;

    return degrees;
};
