const express = require("express");
const router = express.Router();
const { reverseGeocode } = require("../services/geocodingService");
const NodeCache = require("node-cache");

// 60 minute cache
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

router.get("/", async (req, res) => {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Missing latitude or longitude" });
    }

    const cacheKey = `${latitude}_${longitude}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const data = await reverseGeocode(latitude, longitude);
        cache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to reverse geocode" });
    }
});

module.exports = router;

