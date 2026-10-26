/**
 * API wrapper for communicating with our backend proxy
 */
const API = {
    async fetchWeather(lat, lon) {
        try {
            const res = await fetch(`/api/weather?latitude=${lat}&longitude=${lon}`);
            if (!res.ok) throw new Error('Weather API Error');
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async searchLocations(query) {
        try {
            const res = await fetch(`/api/search?name=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error('Search API Error');
            const data = await res.json();
            return data.results || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async fetchAQI(lat, lon) {
        try {
            const res = await fetch(`/api/air-quality?latitude=${lat}&longitude=${lon}`);
            if (!res.ok) throw new Error('AQI API Error');
            return await res.json();
        } catch (error) {
            console.error(error);
            return null; // Return null if AQI fails so the main weather app doesn't crash
        }
    }
};
