const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const Cache = require('../utils/cache');
const { CACHE_TTL_MS } = require('../config/constants');

const weatherCache = new Cache(CACHE_TTL_MS);

router.get('/', async (req, res) => {
    try {
        const lat = parseFloat(req.query.latitude);
        const lon = parseFloat(req.query.longitude);

        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            return res.status(400).json({ error: "Invalid latitude or longitude." });
        }

        // Cache key based on coordinates rounded to 3 decimal places (~111m precision)
        const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
        const cachedData = weatherCache.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await weatherService.getWeather(lat, lon);
        weatherCache.set(cacheKey, data);
        
        res.json(data);

    } catch (error) {
        console.error("Weather API Error:", error.message);
        // Do not expose stack traces to client
        if (error.name === 'AbortError') {
            res.status(504).json({ error: "Weather API timeout." });
        } else {
            res.status(502).json({ error: "Failed to fetch weather data." });
        }
    }
});

module.exports = router;
