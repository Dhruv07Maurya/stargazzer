/**
 * Space Weather Route
 * Sources: NASA DONKI, NOAA SWPC
 * All URLs from .env via apiConfig
 */
const express = require('express');
const router = express.Router();
const { fetchWithRetry: fetch } = require('../services/fetchWithTimeout');
const { safeFetch } = require('../services/fetchWithTimeout');
const config = require('../config/apiConfig');
const cache = require('../services/cacheService');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/space-weather/solar-flares — Recent solar flare activity
router.get('/solar-flares', asyncHandler(async (req, res) => {
    const cacheKey = 'solar_flares';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const url = `${config.NASA_DONKI_URL}/FLR?startDate=${startDate}&api_key=${config.NASA_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const flares = (Array.isArray(data) ? data : []).map(f => ({
        id: f.flrID,
        beginTime: f.beginTime,
        peakTime: f.peakTime,
        endTime: f.endTime,
        classType: f.classType,
        sourceLocation: f.sourceLocation,
        activeRegionNum: f.activeRegionNum,
        linkedEvents: f.linkedEvents,
    }));

    cache.set(cacheKey, flares, config.CACHE_TTL_MEDIUM);
    res.json({ success: true, data: flares });
}));

// GET /api/space-weather/geomagnetic-storms — Recent geomagnetic storms
router.get('/geomagnetic-storms', asyncHandler(async (req, res) => {
    const cacheKey = 'geo_storms';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const url = `${config.NASA_DONKI_URL}/GST?startDate=${startDate}&api_key=${config.NASA_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const storms = (Array.isArray(data) ? data : []).map(s => ({
        id: s.gstID,
        startTime: s.startTime,
        kpIndex: s.allKpIndex,
        linkedEvents: s.linkedEvents,
    }));

    cache.set(cacheKey, storms, config.CACHE_TTL_MEDIUM);
    res.json({ success: true, data: storms });
}));

// GET /api/space-weather/kp-index — Planetary Kp Index (NOAA)
router.get('/kp-index', asyncHandler(async (req, res) => {
    const cacheKey = 'kp_index';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const response = await fetch(config.NOAA_KP_INDEX_URL);
    const data = await response.json();

    cache.set(cacheKey, data, config.CACHE_TTL_SHORT);
    res.json({ success: true, data });
}));

// GET /api/space-weather/solar-wind — Solar wind plasma data
router.get('/solar-wind', asyncHandler(async (req, res) => {
    const cacheKey = 'solar_wind';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const response = await fetch(config.NOAA_SOLAR_WIND_URL);
    const data = await response.json();

    cache.set(cacheKey, data, config.CACHE_TTL_SHORT);
    res.json({ success: true, data });
}));

// GET /api/space-weather/alerts — Space weather alerts (NOAA)
router.get('/alerts', asyncHandler(async (req, res) => {
    const cacheKey = 'sw_alerts';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const response = await fetch(config.NOAA_ALERTS_URL);
    const data = await response.json();

    cache.set(cacheKey, data, config.CACHE_TTL_SHORT);
    res.json({ success: true, data });
}));

// GET /api/space-weather/cme — Coronal Mass Ejections
router.get('/cme', asyncHandler(async (req, res) => {
    const cacheKey = 'cme_events';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const url = `${config.NASA_DONKI_URL}/CME?startDate=${startDate}&api_key=${config.NASA_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    cache.set(cacheKey, data, config.CACHE_TTL_MEDIUM);
    res.json({ success: true, data });
}));

// GET /api/space-weather/summary — Combined dashboard summary
router.get('/summary', asyncHandler(async (req, res) => {
    const cacheKey = 'sw_summary';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const [kpData, alerts, flares] = await Promise.all([
        safeFetch(config.NOAA_KP_INDEX_URL),
        safeFetch(config.NOAA_ALERTS_URL),
        safeFetch(`${config.NASA_DONKI_URL}/FLR?startDate=${new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]}&api_key=${config.NASA_API_KEY}`),
    ]);

    const latestKp = Array.isArray(kpData) && kpData.length > 1 ? kpData[kpData.length - 1] : null;
    const kpValue = latestKp ? parseFloat(latestKp[1]) : 0;

    let activityLevel = 'Quiet';
    if (kpValue >= 7) activityLevel = 'Extreme Storm';
    else if (kpValue >= 5) activityLevel = 'Storm';
    else if (kpValue >= 4) activityLevel = 'Active';
    else if (kpValue >= 2) activityLevel = 'Unsettled';

    const summary = {
        kpIndex: kpValue,
        activityLevel,
        recentFlares: Array.isArray(flares) ? flares.length : 0,
        activeAlerts: Array.isArray(alerts) ? alerts.length : 0,
        strongestRecentFlare: Array.isArray(flares) && flares.length > 0 ? flares[flares.length - 1].classType : 'None',
    };

    cache.set(cacheKey, summary, config.CACHE_TTL_SHORT);
    res.json({ success: true, data: summary });
}));

module.exports = router;
