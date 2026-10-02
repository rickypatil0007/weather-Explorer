const { WEATHER_API_URL } = require('../config/constants');
const fetchWithTimeout = require('../utils/fetchWithTimeout');

function normalizeWeatherCode(code) {
    const codes = {
        0: { text: "Clear Sky", icon: "☀️" },
        1: { text: "Mainly Clear", icon: "🌤️" },
        2: { text: "Partly Cloudy", icon: "⛅" },
        3: { text: "Overcast", icon: "☁️" },
        45: { text: "Fog", icon: "🌫️" },
        48: { text: "Depositing Rime Fog", icon: "🌫️" },
        51: { text: "Light Drizzle", icon: "🌦️" },
        53: { text: "Moderate Drizzle", icon: "🌦️" },
        55: { text: "Dense Drizzle", icon: "🌧️" },
        61: { text: "Slight Rain", icon: "🌧️" },
        63: { text: "Moderate Rain", icon: "🌧️" },
        65: { text: "Heavy Rain", icon: "🌧️" },
        71: { text: "Slight Snow", icon: "❄️" },
        73: { text: "Moderate Snow", icon: "❄️" },
        75: { text: "Heavy Snow", icon: "❄️" },
        95: { text: "Thunderstorm", icon: "⛈️" }
    };
    return codes[code] || { text: "Unknown", icon: "❓" };
}

async function getWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,is_day',
        hourly: 'temperature_2m,weather_code,precipitation_probability,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max',
        forecast_days: 10,
        timezone: 'auto'
    });

    const url = `${WEATHER_API_URL}?${params.toString()}`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
        throw new Error(`Open-Meteo API Error: ${response.status}`);
    }

    const data = await response.json();
    return normalizeWeatherData(data);
}

function normalizeWeatherData(data) {
    const currentCode = normalizeWeatherCode(data.current.weather_code);
    
    const forecast = [];
    // 10-day forecast
    for (let i = 0; i < data.daily.time.length; i++) {
        const codeInfo = normalizeWeatherCode(data.daily.weather_code[i]);
        forecast.push({
            date: data.daily.time[i],
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
            icon: codeInfo.icon,
            condition: codeInfo.text,
            precipitationProb: data.daily.precipitation_probability_max[i]
        });
    }

    const hourly = [];
    // Next 24 hours
    const currentHourTime = new Date(data.current.time).getTime();
    let startIndex = data.hourly.time.findIndex(t => new Date(t).getTime() >= currentHourTime);
    if (startIndex === -1) startIndex = 0;
    
    for (let i = startIndex; i < startIndex + 24 && i < data.hourly.time.length; i++) {
        const codeInfo = normalizeWeatherCode(data.hourly.weather_code[i]);
        hourly.push({
            time: data.hourly.time[i],
            temp: Math.round(data.hourly.temperature_2m[i]),
            precipitationProb: data.hourly.precipitation_probability[i],
            windSpeed: data.hourly.wind_speed_10m[i],
            icon: codeInfo.icon,
            condition: codeInfo.text
        });
    }

    return {
        timezone: data.timezone,
        current: {
            time: data.current.time,
            temperature: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            windDirection: data.current.wind_direction_10m,
            pressure: data.current.surface_pressure,
            precipitation: data.current.precipitation,
            condition: currentCode.text,
            icon: currentCode.icon,
            isDay: data.current.is_day === 1,
            weatherCode: data.current.weather_code,
            uvIndex: data.daily.uv_index_max && data.daily.uv_index_max.length > 0 ? data.daily.uv_index_max[0] : 0
        },
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
        forecast: forecast,
        hourly: hourly
    };
}

module.exports = { getWeather };
