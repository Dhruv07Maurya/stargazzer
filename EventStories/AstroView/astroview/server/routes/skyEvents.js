/**
 * Sky Events Route
 * Sources: ISS tracking, NOAA aurora, Astronomy data
 * All URLs from .env via apiConfig
 */
const express = require('express');
const router = express.Router();
const { fetchWithRetry: fetch } = require('../services/fetchWithTimeout');
const config = require('../config/apiConfig');
const cache = require('../services/cacheService');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/sky-events/iss — ISS current position
router.get('/iss', asyncHandler(async (req, res) => {
    const cacheKey = 'iss_position';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const response = await fetch(config.ISS_POSITION_URL);
    const data = await response.json();

    const result = {
        latitude: parseFloat(data.iss_position?.latitude),
        longitude: parseFloat(data.iss_position?.longitude),
        timestamp: data.timestamp,
    };

    cache.set(cacheKey, result, 30); // 30 second cache
    res.json({ success: true, data: result });
}));

// GET /api/sky-events/iss-detail — ISS detailed info (velocity, altitude, etc.)
router.get('/iss-detail', asyncHandler(async (req, res) => {
    const cacheKey = 'iss_detail';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const response = await fetch(config.ISS_PASS_URL);
    const data = await response.json();

    const result = {
        name: data.name,
        id: data.id,
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: data.altitude,
        velocity: data.velocity,
        visibility: data.visibility,
        timestamp: data.timestamp,
        units: data.units,
    };

    cache.set(cacheKey, result, 30);
    res.json({ success: true, data: result });
}));

// GET /api/sky-events/aurora — Aurora forecast
router.get('/aurora', asyncHandler(async (req, res) => {
    const cacheKey = 'aurora_forecast';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const response = await fetch(config.NOAA_AURORA_URL);
    const data = await response.json();

    cache.set(cacheKey, data, config.CACHE_TTL_SHORT);
    res.json({ success: true, data });
}));

// GET /api/sky-events/weather — Weather for sky visibility at a location
router.get('/weather', asyncHandler(async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ success: false, error: 'lat and lon required' });

    const cacheKey = `weather_${lat}_${lon}`;
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const url = `${config.OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,cloud_cover,visibility,wind_speed_10m&daily=sunrise,sunset&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();

    cache.set(cacheKey, data, config.CACHE_TTL_SHORT);
    res.json({ success: true, data });
}));

// GET /api/sky-events/apod — NASA Astronomy Picture of the Day
router.get('/apod', asyncHandler(async (req, res) => {
    const cacheKey = 'nasa_apod';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const response = await fetch(`${config.NASA_APOD_URL}?api_key=${config.NASA_API_KEY}`);
    const data = await response.json();

    cache.set(cacheKey, data, config.CACHE_TTL_LONG);
    res.json({ success: true, data });
}));

module.exports = router;
