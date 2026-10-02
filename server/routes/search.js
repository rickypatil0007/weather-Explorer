const express = require('express');
const router = express.Router();
const geocodingService = require('../services/geocodingService');

router.get('/', async (req, res) => {
    try {
        const query = req.query.name;

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({ error: "Search query 'name' is required." });
        }

        const results = await geocodingService.searchLocation(query.trim());
        res.json({ results });

    } catch (error) {
        console.error("Geocoding API Error:", error.message);
        if (error.name === 'AbortError') {
            res.status(504).json({ error: "Search API timeout." });
        } else {
            res.status(502).json({ error: "Failed to search location." });
        }
    }
});

module.exports = router;
