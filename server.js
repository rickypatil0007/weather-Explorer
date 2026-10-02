require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: "ok",
        service: "weather-explorer"
    });
});

// API Routes
app.use('/api/weather', require('./server/routes/weather'));
app.use('/api/search', require('./server/routes/search'));
app.use('/api/location/reverse', require('./server/routes/reverse'));
app.use('/api/air-quality', require('./server/routes/aqi'));

// Config Endpoint for frontend
app.get('/api/config', (req, res) => {
    res.json({ mapboxToken: process.env.MAPBOX_API_KEY });
});

// Fallback for SPA or unknown routes - send index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Weather Explorer server running on port ${PORT}`);
    });
}
module.exports = app;
