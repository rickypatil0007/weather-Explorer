/**
 * Weather Logic Controller
 */
const WeatherController = {
    async fetchUserLocation() {
        UI.setCardState('user', 'loading');
        
        try {
            // First get coordinates via HTML5 Geolocation
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
            });
            
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            
            State.userLocation.latitude = lat;
            State.userLocation.longitude = lon;
            
            // Reverse Geocode to get the real city name (Free API, no key required)
            let locName = "My Location";
            let locCountryCode = "";
            try {
                const geoRes = await fetch(`/api/location/reverse?latitude=${lat}&longitude=${lon}`);
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    if (geoData.name) {
                        locName = geoData.name;
                        locCountryCode = geoData.country_code || "";
                    }
                }
            } catch (e) {
                console.warn("Reverse geocoding failed", e);
            }
            
            State.userLocation.name = locName;
            State.userLocation.country_code = locCountryCode;

            // Fetch weather and AQI concurrently
            const [weatherData, aqiData] = await Promise.all([
                API.fetchWeather(lat, lon),
                API.fetchAQI(lat, lon)
            ]);
            
            weatherData.aqi = aqiData;
            
            State.userLocation.weatherData = weatherData;
            State.userLocation.status = 'success';
            
            UI.renderWeatherCard('user', State.userLocation.name, weatherData, locCountryCode);
            
            // Notify map
            emit('userLocationLoaded', { lat, lon });
            
        } catch (error) {
            console.error("User Location Error:", error);
            State.userLocation.status = 'error';
            UI.setCardState('user', 'error');
        }
    },

    async fetchSelectedLocation(lat, lon, name, countryCode = '') {
        UI.setCardState('selected', 'loading');
        
        try {
            let locName = name;
            let locCountryCode = countryCode;
            
            // If the name is just coordinates (from a map click), reverse-geocode to get the actual Country/City
            if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(name)) {
                try {
                    const geoRes = await fetch(`/api/location/reverse?latitude=${lat}&longitude=${lon}`);
                    if (geoRes.ok) {
                        const geoData = await geoRes.json();
                        if (geoData.name) {
                            locName = geoData.name;
                            locCountryCode = geoData.country_code || '';
                        }
                    }
                } catch (e) {
                    console.warn("Reverse geocoding failed", e);
                }
            }

            State.selectedLocation.latitude = lat;
            State.selectedLocation.longitude = lon;
            State.selectedLocation.name = locName;
            State.selectedLocation.country_code = locCountryCode;

            const [weatherData, aqiData] = await Promise.all([
                API.fetchWeather(lat, lon),
                API.fetchAQI(lat, lon)
            ]);
            
            weatherData.aqi = aqiData;
            
            State.selectedLocation.weatherData = weatherData;
            State.selectedLocation.status = 'success';
            
            UI.renderWeatherCard('selected', locName, weatherData, locCountryCode);
            
            // Notify map to drop pin
            emit('selectedLocationLoaded', { lat, lon, name: locName });
            
        } catch (error) {
            console.error("Selected Location Error:", error);
            State.selectedLocation.status = 'error';
            UI.setCardState('selected', 'error');
            alert("Failed to fetch weather for selected location.");
        }
    }
};
