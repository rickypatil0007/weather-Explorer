const express = require("express");
const router = express.Router();
const { getAirQuality } = require("../services/aqiService");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 1800, checkperiod: 600 }); // 30 min cache

router.get("/", async (req, res) => {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    const cacheKey = `${latitude}_${longitude}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const data = await getAirQuality(latitude, longitude);
        cache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch AQI data" });
    }
});

module.exports = router;

