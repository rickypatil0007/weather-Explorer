const CONSTANTS = {
    WEATHER_API_URL: 'https://api.open-meteo.com/v1/forecast',
    GEOCODING_API_URL: 'https://geocoding-api.open-meteo.com/v1/search',
    API_TIMEOUT_MS: 8000,
    CACHE_TTL_MS: 15 * 60 * 1000, // 15 minutes
};

module.exports = CONSTANTS;
