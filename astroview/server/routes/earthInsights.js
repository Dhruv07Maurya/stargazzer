/**
 * Earth Insights Route
 * Sources: NASA EONET, EPIC, POWER
 * All URLs from .env via apiConfig
 */
const express = require('express');
const router = express.Router();
const { fetchWithRetry: fetch } = require('../services/fetchWithTimeout');
const config = require('../config/apiConfig');
const cache = require('../services/cacheService');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/earth-insights/events — Natural events (wildfires, storms, volcanoes)
router.get('/events', asyncHandler(async (req, res) => {
    const cacheKey = 'eonet_events';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const limit = req.query.limit || 20;
    const status = req.query.status || 'open';
    const url = `${config.NASA_EONET_URL}?limit=${limit}&status=${status}&api_key=${config.NASA_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const events = (data.events || []).map(e => ({
        id: e.id,
        title: e.title,
        description: e.description || '',
        category: e.categories?.[0]?.title || 'Unknown',
        categoryId: e.categories?.[0]?.id || '',
        sources: e.sources?.map(s => ({ id: s.id, url: s.url })) || [],
        geometry: e.geometry?.map(g => ({
            date: g.date,
            type: g.type,
            coordinates: g.coordinates,
        })) || [],
    }));

    cache.set(cacheKey, events, config.CACHE_TTL_MEDIUM);
    res.json({ success: true, data: events });
}));

// GET /api/earth-insights/epic — Latest Earth images from DSCOVR
router.get('/epic', asyncHandler(async (req, res) => {
    const cacheKey = 'epic_images';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const url = `${config.NASA_EPIC_URL}/api/natural?api_key=${config.NASA_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const images = (Array.isArray(data) ? data.slice(0, 5) : []).map(img => {
        const date = img.date.split(' ')[0].replace(/-/g, '/');
        return {
            identifier: img.identifier,
            caption: img.caption,
            date: img.date,
            imageUrl: `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${img.image}.png`,
            centroidCoordinates: img.centroid_coordinates,
            attitude_quaternions: img.attitude_quaternions,
        };
    });

    cache.set(cacheKey, images, config.CACHE_TTL_LONG);
    res.json({ success: true, data: images });
}));

// GET /api/earth-insights/climate — Climate data for a location (NASA POWER)
router.get('/climate', asyncHandler(async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ success: false, error: 'lat and lon required' });

    const cacheKey = `climate_${lat}_${lon}`;
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const endDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const startDate = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0].replace(/-/g, '');

    const url = `${config.NASA_POWER_URL}?parameters=T2M,PRECTOTCORR,RH2M&community=RE&longitude=${lon}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`;
    const response = await fetch(url);
    const data = await response.json();

    cache.set(cacheKey, data, config.CACHE_TTL_LONG);
    res.json({ success: true, data });
}));

// GET /api/earth-insights/categories — EONET event categories
router.get('/categories', asyncHandler(async (req, res) => {
    const cacheKey = 'eonet_categories';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/categories?api_key=${config.NASA_API_KEY}`);
    const data = await response.json();

    cache.set(cacheKey, data.categories || [], config.CACHE_TTL_LONG);
    res.json({ success: true, data: data.categories || [] });
}));

module.exports = router;
