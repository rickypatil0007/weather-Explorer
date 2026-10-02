/**
 * UI Rendering and DOM Manipulation
 */
const UI = {
    elements: {
        // Theme
        themeBtn: document.getElementById('btn-theme-toggle'),
        
        // Search
        searchInput: document.getElementById('search-input'),
        searchForm: document.getElementById('search-form'),
        searchResults: document.getElementById('search-results'),
        
        // My Location
        myLocationBtn: document.getElementById('btn-my-location'),
        
        // Map
        mapContainer: document.getElementById('map-container'),
        
        // Cards
        cardUser: document.getElementById('card-user'),
        cardSelected: document.getElementById('card-selected'),
        
        // Forecasts
        userForecastContainer: document.getElementById('user-forecast-container'),
        selForecastContainer: document.getElementById('sel-forecast-container')
    },

    initTheme() {
        // Theme toggle removed per user request. App is purely driven by weather background.
    },

    setCardState(cardType, status) {
        const card = cardType === 'user' ? this.elements.cardUser : this.elements.cardSelected;
        
        // Hide all initially
        card.querySelector('.card-loading').classList.add('hidden');
        card.querySelector('.card-content').classList.add('hidden');
        
        const errorEl = card.querySelector('.card-error');
        if (errorEl) errorEl.classList.add('hidden');
        
        const emptyEl = card.querySelector('.empty-placeholder');
        if (emptyEl) emptyEl.classList.add('hidden');

        // Show appropriate state
        if (status === 'loading') {
            card.querySelector('.card-loading').classList.remove('hidden');
        } else if (status === 'success') {
            card.querySelector('.card-content').classList.remove('hidden');
            card.classList.remove('empty-state');
        } else if (status === 'error') {
            if (errorEl) errorEl.classList.remove('hidden');
            card.classList.add('empty-state');
        } else if (status === 'idle') {
            if (emptyEl) emptyEl.classList.remove('hidden');
            card.classList.add('empty-state');
        }
    },

    renderWeatherCard(cardType, locationName, weatherData, countryCode = '') {
        const prefix = cardType === 'user' ? 'user' : 'sel';
        
        let flagEmoji = '';
        if (countryCode && countryCode.length === 2) {
            flagEmoji = countryCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397)) + ' ';
        }

        document.getElementById(`${prefix}-location-name`).innerText = flagEmoji + (locationName || 'Unknown Location');
        
        // Format time
        const now = new Date();
        document.getElementById(`${prefix}-location-time`).innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const current = weatherData.current;
        document.getElementById(`${prefix}-temp`).innerText = current.temperature;
        document.getElementById(`${prefix}-icon`).innerText = current.icon;
        document.getElementById(`${prefix}-condition`).innerText = current.condition;
        
        document.getElementById(`${prefix}-feels`).innerText = `${current.feelsLike}°C`;
        document.getElementById(`${prefix}-humidity`).innerText = `${current.humidity}%`;
        document.getElementById(`${prefix}-wind`).innerText = `${current.windSpeed} km/h`;
        
        let uvValue = current.uvIndex || 0;
        document.getElementById(`${prefix}-uv`).innerText = uvValue;
        
        if (weatherData.aqi) {
            document.getElementById(`${prefix}-aqi`).innerText = `${weatherData.aqi.aqi} (${weatherData.aqi.quality})`;
        } else {
            document.getElementById(`${prefix}-aqi`).innerText = 'N/A';
        }
        
        this.setCardState(cardType, 'success');
        this.renderForecast(cardType, weatherData.forecast);
        this.updateComparison();
        this.updateGlobalScene();
    },

    renderForecast(cardType, forecastData) {
        const container = cardType === 'user' ? this.elements.userForecastContainer : this.elements.selForecastContainer;
        container.innerHTML = '';
        
        forecastData.forEach((day, index) => {
            const dateObj = new Date(day.date);
            const dayName = index === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            
            const html = `
                <div class="forecast-item">
                    <span class="day">${dayName}</span>
                    <span class="icon">${day.icon}</span>
                    <span class="temps">${day.maxTemp}° / ${day.minTemp}°</span>
                    <span class="rain">💧 ${day.precipitationProb}%</span>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    },

    updateComparison() {
        const user = State.userLocation.weatherData?.current;
        const sel = State.selectedLocation.weatherData?.current;

        const updateCell = (id, val) => {
            document.getElementById(id).innerText = val !== undefined && val !== null ? val : '--';
        };

        updateCell('comp-temp-user', user ? `${user.temperature}°C` : '--');
        updateCell('comp-feels-user', user ? `${user.feelsLike}°C` : '--');
        updateCell('comp-hum-user', user ? `${user.humidity}%` : '--');
        updateCell('comp-wind-user', user ? `${user.windSpeed} km/h` : '--');
        updateCell('comp-pres-user', user ? `${user.pressure} hPa` : '--');
        updateCell('comp-vis-user', user ? user.condition : '--');
        updateCell('comp-uv-user', user ? user.uvIndex : '--');
        updateCell('comp-aqi-user', State.userLocation.weatherData?.aqi ? `${State.userLocation.weatherData.aqi.aqi} (${State.userLocation.weatherData.aqi.quality})` : '--');

        updateCell('comp-temp-sel', sel ? `${sel.temperature}°C` : '--');
        updateCell('comp-feels-sel', sel ? `${sel.feelsLike}°C` : '--');
        updateCell('comp-hum-sel', sel ? `${sel.humidity}%` : '--');
        updateCell('comp-wind-sel', sel ? `${sel.windSpeed} km/h` : '--');
        updateCell('comp-pres-sel', sel ? `${sel.pressure} hPa` : '--');
        updateCell('comp-vis-sel', sel ? sel.condition : '--');
        updateCell('comp-uv-sel', sel ? sel.uvIndex : '--');
        updateCell('comp-aqi-sel', State.selectedLocation.weatherData?.aqi ? `${State.selectedLocation.weatherData.aqi.aqi} (${State.selectedLocation.weatherData.aqi.quality})` : '--');
    },

    updateGlobalScene() {
        // Prefer selected location if it exists and has weather data, otherwise fallback to user location
        const activeWeather = State.selectedLocation.weatherData || State.userLocation.weatherData;
        if (!activeWeather) return;

        const current = activeWeather.current;
        let conditionStr = current.condition.toLowerCase();
        let bgType = 'clear';
        
        if (conditionStr.includes('rain') || conditionStr.includes('drizzle') || conditionStr.includes('thunder')) {
            bgType = 'rain';
        } else if (conditionStr.includes('snow')) {
            bgType = 'snow';
        } else if (conditionStr.includes('cloud') || conditionStr.includes('overcast') || conditionStr.includes('fog')) {
            bgType = 'cloudy';
        }
        
        const timeOfDay = current.isDay ? 'day' : 'night';
        let bgClass = (bgType === 'rain' || bgType === 'snow') ? `bg-${bgType}` : `bg-${timeOfDay}-${bgType}`;
        
        // Add evening/dusk support
        // We can infer evening if the current time is close to the sunset time.
        if (activeWeather.sunset && activeWeather.current && activeWeather.current.time) {
            const sunsetTime = new Date(activeWeather.sunset).getTime();
            const nowTime = new Date(activeWeather.current.time).getTime(); // Use location's local time string!
            const diffHours = (nowTime - sunsetTime) / (1000 * 60 * 60);
            
            // If we are within +/- 1.5 hours of sunset, call it evening
            if (diffHours >= -1.5 && diffHours <= 1.5 && (bgType === 'clear' || bgType === 'cloudy')) {
                bgClass = `bg-evening-${bgType}`;
            }
        }
        
        const sceneEl = document.getElementById('weather-scene');
        if (sceneEl) {
            sceneEl.className = bgClass;
        }
    }
};
