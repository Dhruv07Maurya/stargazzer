/**
 * Centralized API Configuration
 * ALL API URLs and keys are read from .env — never hardcoded.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
    // NASA
    NASA_API_KEY: process.env.NASA_API_KEY,
    NASA_APOD_URL: process.env.NASA_APOD_URL,
    NASA_DONKI_URL: process.env.NASA_DONKI_URL,
    NASA_EONET_URL: process.env.NASA_EONET_URL,
    NASA_EPIC_URL: process.env.NASA_EPIC_URL,
    NASA_POWER_URL: process.env.NASA_POWER_URL,
    NASA_IMAGE_LIBRARY_URL: process.env.NASA_IMAGE_LIBRARY_URL,

    // Launch Library 2
    LAUNCH_LIBRARY_URL: process.env.LAUNCH_LIBRARY_URL,

    // SpaceX
    SPACEX_API_URL: process.env.SPACEX_API_URL,

    // ISRO
    ISRO_API_URL: process.env.ISRO_API_URL,

    // ISS
    ISS_POSITION_URL: process.env.ISS_POSITION_URL,
    ISS_PASS_URL: process.env.ISS_PASS_URL,

    // NOAA Space Weather
    NOAA_AURORA_URL: process.env.NOAA_AURORA_URL,
    NOAA_KP_INDEX_URL: process.env.NOAA_KP_INDEX_URL,
    NOAA_SOLAR_WIND_URL: process.env.NOAA_SOLAR_WIND_URL,
    NOAA_FORECAST_URL: process.env.NOAA_FORECAST_URL,
    NOAA_ALERTS_URL: process.env.NOAA_ALERTS_URL,

    // Open-Meteo
    OPEN_METEO_URL: process.env.OPEN_METEO_URL,

    // Cache TTLs (seconds)
    CACHE_TTL_SHORT: parseInt(process.env.CACHE_TTL_SHORT) || 300,
    CACHE_TTL_MEDIUM: parseInt(process.env.CACHE_TTL_MEDIUM) || 3600,
    CACHE_TTL_LONG: parseInt(process.env.CACHE_TTL_LONG) || 21600,

    // Server
    PORT: parseInt(process.env.PORT) || 5000,
};
