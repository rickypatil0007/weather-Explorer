const fetchWithTimeout = require("../utils/fetchWithTimeout");

async function getAirQuality(lat, lon) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,uv_index`;
    
    try {
        const response = await fetchWithTimeout(url);
        if (!response.ok) {
            throw new Error(`Open-Meteo AQI API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Map AQI to human-readable format
        const aqi = data.current.us_aqi || 0;
        let quality = "Good";
        if (aqi > 50 && aqi <= 100) quality = "Moderate";
        else if (aqi > 100 && aqi <= 150) quality = "Unhealthy for Sensitive Groups";
        else if (aqi > 150 && aqi <= 200) quality = "Unhealthy";
        else if (aqi > 200 && aqi <= 300) quality = "Very Unhealthy";
        else if (aqi > 300) quality = "Hazardous";
        
        return {
            aqi: aqi,
            quality: quality,
            pm10: data.current.pm10 || 0,
            pm2_5: data.current.pm2_5 || 0,
            uvIndex: data.current.uv_index || 0
        };
    } catch (error) {
        console.error("AQI fetch failed:", error.message);
        throw error;
    }
}

module.exports = { getAirQuality };

