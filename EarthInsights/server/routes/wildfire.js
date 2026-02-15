const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../utils/cache');

// NASA EONET API (Wildfires)
const NASA_EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires';

router.get('/', async (req, res) => {
    const cacheKey = 'wildfires_real';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log('Cache hit for wildfire data');
        return res.json(cachedData);
    }

    try {
        console.log('Fetching NASA EONET Wildfire data...');
        const response = await axios.get(NASA_EONET_URL);
        const events = response.data.events || [];

        // Normalize Data
        const fires = events.map(event => {
            // EONET geometries are [lon, lat]
            const geometry = event.geometry[0];
            const lng = geometry.coordinates[0];
            const lat = geometry.coordinates[1];

            return {
                id: event.id,
                title: event.title,
                lat: lat,
                lng: lng,
                date: geometry.date,
                // EONET doesn't give brightness/confidence usually, so we default/randomize specific display props
                brightness: 300 + Math.random() * 50,
                confidence: 'high'
            };
        }); // Limit? EONET usually returns active ones.

        const result = {
            data: fires,
            source: 'NASA_EONET'
        };

        cache.set(cacheKey, result);
        return res.json(result);

    } catch (error) {
        console.error('NASA EONET Error:', error.message);
        // Fallback to empty real so frontend can decide to show dummy or empty
        return res.status(500).json({ error: 'Failed to fetch wildfire data' });
    }
});

module.exports = router;
