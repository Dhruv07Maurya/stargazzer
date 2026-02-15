const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../utils/cache');

// NASA POWER API Endpoint
const NASA_POWER_URL = 'https://power.larc.nasa.gov/api/temporal/monthly/point';

router.get('/', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    const cacheKey = `temp_${lat}_${lon}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log(`Cache hit for ${cacheKey}`);
        return res.json(cachedData);
    }

    try {
        console.log(`Fetching NASA data for ${lat}, ${lon}`);
        // NASA POWER API allows querying up to "near real-time" but monthly data lags.
        // Using 2023 is guaranteed to have data.
        const currentYear = new Date().getFullYear();
        const startYear = 2000;
        const endYear = 2023; // Safe hardcoded limit for demo stability

        const response = await axios.get(NASA_POWER_URL, {
            params: {
                parameters: 'T2M,PRECTOTCORR,WS2M',
                community: 'RE',
                longitude: lon,
                latitude: lat,
                start: startYear,
                end: endYear,
                format: 'JSON'
            }
        });

        const data = response.data;

        // Data Normalization Logic
        const monthlyData = [];
        let baselineSum = 0;
        let baselineCount = 0;
        let currentYearSum = 0;
        let currentYearCount = 0;

        // Process parameters
        const t2m = data.properties.parameter.T2M || {};
        const prec = data.properties.parameter.PRECTOTCORR || {}; // Precipitation

        const yearlyData = {};

        // Process Temperature
        Object.keys(t2m).forEach(dateStr => {
            const year = parseInt(dateStr.substring(0, 4));
            const value = t2m[dateStr];
            if (value === -999) return;

            if (!yearlyData[year]) {
                yearlyData[year] = { tempSum: 0, tempCount: 0, rainSum: 0, rainCount: 0 };
            }
            yearlyData[year].tempSum += value;
            yearlyData[year].tempCount++;
        });

        // Process Rainfall
        Object.keys(prec).forEach(dateStr => {
            const year = parseInt(dateStr.substring(0, 4));
            const value = prec[dateStr];
            if (value === -999) return;

            if (!yearlyData[year]) {
                yearlyData[year] = { tempSum: 0, tempCount: 0, rainSum: 0, rainCount: 0 };
            }
            yearlyData[year].rainSum += value;
            yearlyData[year].rainCount++;
        });

        // Calculate Baselines (2000-2010)
        let tempBaselineSum = 0;
        let tempBaselineCount = 0;

        Object.keys(yearlyData).forEach(y => {
            const year = parseInt(y);
            const d = yearlyData[year];
            if (year >= 2000 && year <= 2010 && d.tempCount > 0) {
                tempBaselineSum += (d.tempSum / d.tempCount);
                tempBaselineCount++;
            }
        });

        const tempBaselineAvg = tempBaselineCount > 0 ? (tempBaselineSum / tempBaselineCount) : 0;

        const processedData = Object.keys(yearlyData).map(yearStr => {
            const year = parseInt(yearStr);
            const d = yearlyData[year];

            const avgTemp = d.tempCount > 0 ? d.tempSum / d.tempCount : 0;
            const avgRain = d.rainCount > 0 ? d.rainSum / d.rainCount : 0; // Monthly avg per year

            return {
                year: year,
                anomaly: d.tempCount > 0 ? parseFloat((avgTemp - tempBaselineAvg).toFixed(2)) : 0,
                rainfall: parseFloat(avgRain.toFixed(2)) // mm/day average
            };
        });

        const result = {
            location: {
                lat: parseFloat(lat),
                lon: parseFloat(lon)
            },
            data: processedData,
            source: 'NASA_POWER'
        };

        // Cache for 30 mins
        cache.set(cacheKey, result);

        return res.json(result);

    } catch (error) {
        console.error('NASA API Error:', error.message);
        return res.status(500).json({
            error: 'Failed to fetch data from NASA',
            details: error.message
        });
    }
});

module.exports = router;
