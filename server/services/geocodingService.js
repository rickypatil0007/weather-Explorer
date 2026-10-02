const axios = require("axios");

async function searchLocation(query) {
    try {
        const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        if (!response.data.results) return [];
        
        return response.data.results.map(loc => ({
            name: loc.name,
            country: loc.country,
            country_code: loc.country_code,
            admin1: loc.admin1, // State/Province
            admin2: loc.admin2, // Prefecture/District
            latitude: loc.latitude,
            longitude: loc.longitude
        }));
    } catch (error) {
        console.error("Geocoding API Error:", error.message);
        throw new Error("Failed to search location");
    }
}

async function reverseGeocode(lat, lon) {
    try {
        const MAPBOX_TOKEN = process.env.MAPBOX_API_KEY;
        const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lon}&latitude=${lat}&types=place,locality,neighborhood,postcode,district,region,country&limit=1&access_token=${MAPBOX_TOKEN}`;
        
        const response = await axios.get(url);
        
        if (response.data && response.data.features && response.data.features.length > 0) {
            const feature = response.data.features[0];
            const context = feature.properties.context || {};
            
            let city = feature.properties.name || "Unknown Location";
            let country = context.country ? context.country.name : "";
            let countryCode = context.country ? context.country.country_code : "";
            
            return {
                name: `${city}${country ? ", " + country : ""}`,
                city: city,
                country: country,
                country_code: countryCode,
                latitude: lat,
                longitude: lon
            };
        } else {
            return { name: `${lat.toFixed(4)}, ${lon.toFixed(4)}`, latitude: lat, longitude: lon };
        }
    } catch (error) {
        console.error("Mapbox Reverse Geocoding Error:", error.message);
        return { name: `${lat.toFixed(4)}, ${lon.toFixed(4)}`, latitude: lat, longitude: lon };
    }
}

module.exports = { searchLocation, reverseGeocode };

