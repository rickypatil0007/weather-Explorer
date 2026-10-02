/**
 * weatherScene.js
 * COMPLETE REAL-TIME WEATHER SCENE ENGINE
 */

const WeatherScene = (function() {
    // DOM Elements
    let sceneContainer;
    
    // Active Location state
    let activeSceneLocation = 'user'; // 'user' or 'selected'

    // Scene definitions
    const weatherMapping = {
        0: { type: 'clear', intensity: 'none', label: 'Clear sky' },
        1: { type: 'mainly-clear', intensity: 'light', label: 'Mainly clear' },
        2: { type: 'partly-cloudy', intensity: 'moderate', label: 'Partly cloudy' },
        3: { type: 'overcast', intensity: 'heavy', label: 'Overcast' },
        
        45: { type: 'fog', intensity: 'moderate', label: 'Fog' },
        48: { type: 'fog', intensity: 'heavy', label: 'Rime fog' },
        
        51: { type: 'drizzle', intensity: 'light', label: 'Light drizzle' },
        53: { type: 'drizzle', intensity: 'moderate', label: 'Moderate drizzle' },
        55: { type: 'drizzle', intensity: 'heavy', label: 'Dense drizzle' },
        56: { type: 'freezing-rain', intensity: 'light', label: 'Light freezing drizzle' },
        57: { type: 'freezing-rain', intensity: 'heavy', label: 'Dense freezing drizzle' },
        
        61: { type: 'rain', intensity: 'light', label: 'Slight rain' },
        63: { type: 'rain', intensity: 'moderate', label: 'Moderate rain' },
        65: { type: 'rain', intensity: 'heavy', label: 'Heavy rain' },
        66: { type: 'freezing-rain', intensity: 'light', label: 'Light freezing rain' },
        67: { type: 'freezing-rain', intensity: 'heavy', label: 'Heavy freezing rain' },
        
        71: { type: 'snow', intensity: 'light', label: 'Slight snow' },
        73: { type: 'snow', intensity: 'moderate', label: 'Moderate snow' },
        75: { type: 'snow', intensity: 'heavy', label: 'Heavy snow' },
        77: { type: 'snow-grains', intensity: 'moderate', label: 'Snow grains' },
        
        80: { type: 'rain-showers', intensity: 'light', label: 'Slight rain showers' },
        81: { type: 'rain-showers', intensity: 'moderate', label: 'Moderate rain showers' },
        82: { type: 'rain-showers', intensity: 'extreme', label: 'Violent rain showers' },
        
        85: { type: 'snow-showers', intensity: 'light', label: 'Slight snow showers' },
        86: { type: 'snow-showers', intensity: 'heavy', label: 'Heavy snow showers' },
        
        95: { type: 'thunderstorm', intensity: 'moderate', label: 'Thunderstorm' },
        96: { type: 'hail', intensity: 'light', label: 'Thunderstorm with slight hail' },
        97: { type: 'thunderstorm', intensity: 'heavy', label: 'Heavy thunderstorm' },
        99: { type: 'hail', intensity: 'heavy', label: 'Thunderstorm with heavy hail' }
    };

    function init() {
        sceneContainer = document.getElementById('weather-scene');
        if (!sceneContainer) {
            console.error("Weather scene container not found!");
            return;
        }
        
        // Listen for scene control changes
        const sceneToggle = document.getElementById('scene-toggle');
        if (sceneToggle) {
            sceneToggle.addEventListener('change', (e) => {
                activeSceneLocation = e.target.value; // 'user' or 'selected'
                updateScene();
            });
        }
    }

    // Resolves time of day based on is_day flag, and sunrise/sunset times
    function resolveTimePhase(weatherData) {
        if (!weatherData) return 'day';
        
        const isDay = weatherData.is_day; // 0 or 1
        
        // We can do dusk/dawn detection if we have time, sunrise, sunset
        if (weatherData.currentTime && weatherData.sunrise && weatherData.sunset) {
            const now = new Date(weatherData.currentTime).getTime();
            const sunrise = new Date(weatherData.sunrise).getTime();
            const sunset = new Date(weatherData.sunset).getTime();
            
            const oneHour = 60 * 60 * 1000;
            
            if (now >= sunrise - oneHour && now <= sunrise + oneHour) {
                return 'dawn';
            }
            
            if (now >= sunset - oneHour && now <= sunset + oneHour) {
                return 'sunset';
            }
        }
        
        return isDay ? 'day' : 'night';
    }

    // Resolves wind level
    function resolveWindLevel(windSpeed) {
        if (windSpeed === undefined || windSpeed === null) return 'calm';
        if (windSpeed < 10) return 'calm';
        if (windSpeed < 25) return 'light';
        if (windSpeed < 45) return 'moderate';
        if (windSpeed < 70) return 'strong';
        return 'very-strong';
    }

    // Applies CSS variables for dynamic intensity
    function applyIntensityVariables(windSpeed, precipitation) {
        if (windSpeed !== undefined) {
            const normalizedWind = Math.min(Math.max(windSpeed / 100, 0), 1);
            sceneContainer.style.setProperty('--wind-intensity', normalizedWind);
        }
        
        if (precipitation !== undefined) {
            const normalizedPrecip = Math.min(Math.max(precipitation / 20, 0), 1); // 20mm+ is extreme
            sceneContainer.style.setProperty('--precip-intensity', normalizedPrecip);
        }
    }

    // Main update function triggered by app.js when new weather arrives or toggle switches
    function updateScene() {
        if (!sceneContainer) return;
        
        // Get the relevant data from global state
        const targetData = activeSceneLocation === 'user' ? 
                           window.State?.userLocation?.weatherData : 
                           window.State?.selectedLocation?.weatherData;
                           
        if (!targetData || !targetData.current) {
            resetScene();
            return;
        }

        const code = targetData.current.weather_code;
        const windSpeed = targetData.current.wind_speed_10m;
        const precipitation = targetData.current.precipitation || 0; // if provided
        
        // attach current time info for phase
        const weatherContext = {
            is_day: targetData.current.is_day,
            currentTime: targetData.current.time,
            sunrise: targetData.daily?.sunrise?.[0],
            sunset: targetData.daily?.sunset?.[0]
        };

        const mapping = weatherMapping[code] || { type: 'neutral', intensity: 'none' };
        
        const phase = resolveTimePhase(weatherContext);
        const windLevel = resolveWindLevel(windSpeed);
        
        applyIntensityVariables(windSpeed, precipitation);
        
        // Remove old classes
        sceneContainer.className = '';
        
        // Add new classes
        sceneContainer.classList.add(`scene--${mapping.type}`);
        sceneContainer.classList.add(`phase--${phase}`);
        sceneContainer.classList.add(`intensity--${mapping.intensity}`);
        sceneContainer.classList.add(`wind--${windLevel}`);
        
        // Trigger reflow to restart animations cleanly if needed
        void sceneContainer.offsetWidth;
    }

    function resetScene() {
        if (sceneContainer) {
            sceneContainer.className = 'scene--neutral phase--day';
        }
    }

    // Public API
    return {
        init,
        updateScene,
        setActiveLocation: (loc) => {
            activeSceneLocation = loc;
            const toggle = document.getElementById('scene-toggle');
            if (toggle) {
                toggle.value = loc;
            }
            updateScene();
        },
        getActiveLocation: () => activeSceneLocation
    };
})();

// Expose globally
window.WeatherScene = WeatherScene;
