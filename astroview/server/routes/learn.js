/**
 * Learn Route
 * Sources: NASA Image & Video Library
 * All URLs from .env via apiConfig
 */
const express = require('express');
const router = express.Router();
const { fetchWithRetry: fetch } = require('../services/fetchWithTimeout');
const config = require('../config/apiConfig');
const cache = require('../services/cacheService');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/learn/search — Search NASA Image & Video Library
router.get('/search', asyncHandler(async (req, res) => {
    const query = req.query.q || 'space';
    const cacheKey = `nasa_search_${query}`;
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const url = `${config.NASA_IMAGE_LIBRARY_URL}/search?q=${encodeURIComponent(query)}&media_type=image&page_size=20`;
    const response = await fetch(url);
    const data = await response.json();

    const items = (data.collection?.items || []).map(item => ({
        title: item.data?.[0]?.title || '',
        description: item.data?.[0]?.description || '',
        date: item.data?.[0]?.date_created || '',
        nasaId: item.data?.[0]?.nasa_id || '',
        thumbnail: item.links?.[0]?.href || '',
        keywords: item.data?.[0]?.keywords || [],
    }));

    cache.set(cacheKey, items, config.CACHE_TTL_LONG);
    res.json({ success: true, data: items });
}));

// GET /api/learn/apod-archive — Multiple APODs for educational content
router.get('/apod-archive', asyncHandler(async (req, res) => {
    const cacheKey = 'apod_archive';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const url = `${config.NASA_APOD_URL}?api_key=${config.NASA_API_KEY}&count=10`;
    const response = await fetch(url);
    const data = await response.json();

    cache.set(cacheKey, data, config.CACHE_TTL_LONG);
    res.json({ success: true, data });
}));

module.exports = router;
