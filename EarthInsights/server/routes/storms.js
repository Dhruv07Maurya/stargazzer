const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../utils/cache');

const WEATHER_GOV_ALERTS_URL = 'https://api.weather.gov/alerts/active';

router.get('/', async (req, res) => {
    const cacheKey = 'storm_alerts';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log('Cache hit for storm alerts');
        return res.json(cachedData);
    }

    try {
        console.log('Fetching Weather.gov alerts...');
        const response = await axios.get(WEATHER_GOV_ALERTS_URL, {
            headers: {
                'User-Agent': '(EarthInsights, contact@example.com)' // Correct User-Agent required by weather.gov
            },
            params: {
                severity: 'Severe',
                urgency: 'Immediate'
            }
        });

        const features = response.data.features || [];

        // Normalize to StormTrack format
        const storms = features.map(feature => {
            const props = feature.properties;
            const geometry = feature.geometry;

            // Handle different geometry types (Polygon, Point, etc) for "center"
            let center = [0, 0];
            if (geometry) {
                if (geometry.type === 'Point') {
                    center = [geometry.coordinates[1], geometry.coordinates[0]]; // Swap to Lat, Lon
                } else if (geometry.type === 'Polygon') {
                    // Simple centroid approx
                    const coords = geometry.coordinates[0];
                    const lat = coords[0][1];
                    const lon = coords[0][0];
                    center = [lat, lon];
                }
            }

            // Mock path since updates don't consistently give full tracks
            // Create a small "mock" path trailing behind the center
            const path = [
                [center[0] - 1, center[1] - 1],
                [center[0] - 0.5, center[1] - 0.5],
                center
            ];

            // Mock projected path
            const projectedPath = [
                center,
                [center[0] + 0.5, center[1] + 0.5],
                [center[0] + 1, center[1] + 1]
            ];

            return {
                id: props.id,
                name: props.event || 'Unknown Event',
                category: 1, // Default, hard to map severity to Category directly without complex logic
                windSpeed: 0, // Not provided in generic alerts usually
                path: path,
                projectedPath: projectedPath,
                description: props.headline
            };
        }).slice(0, 10); // Limit to 10 for performance

        const result = {
            data: storms,
            source: 'WEATHER_GOV'
        };

        cache.set(cacheKey, result);
        return res.json(result);

    } catch (error) {
        console.error('Weather.gov Error:', error.message);
        return res.status(500).json({
            error: 'Failed to fetch storm data',
            details: error.message
        });
    }
});

module.exports = router;
