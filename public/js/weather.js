/**
 * Weather Logic Controller
 */
const WeatherController = {
    async fetchUserLocation() {
        UI.setCardState('user', 'loading');
        
        try {
            let lat, lon;
            let locName = "My Location";
            let locCountryCode = "";

            // 1. Try HTML5 Geolocation (works on HTTPS or localhost)
            try {
                const pos = await new Promise((resolve, reject) => {
                    if (!navigator.geolocation) {
                        return reject(new Error("Geolocation not supported"));
                    }
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 });
                });
                lat = pos.coords.latitude;
                lon = pos.coords.longitude;
            } catch (geoErr) {
                console.warn("Browser GPS unavailable/blocked (common on HTTP origins), falling back to IP Geolocation:", geoErr);
                // 2. Fallback: Detect location via public IP
                const ipRes = await fetch('https://ipwho.is/');
                const ipData = await ipRes.json();
                if (ipData && ipData.success && ipData.latitude && ipData.longitude) {
                    lat = ipData.latitude;
                    lon = ipData.longitude;
                    locName = ipData.city || ipData.region || "My Location";
                    locCountryCode = ipData.country_code || "";
                } else {
                    throw new Error("Unable to determine location from GPS or IP.");
                }
            }
            
            State.userLocation.latitude = lat;
            State.userLocation.longitude = lon;
            
            // If location name wasn't provided by IP service, reverse geocode coordinates
            if (locName === "My Location") {
                try {
                    const geoRes = await fetch(`/api/location/reverse?latitude=${lat}&longitude=${lon}`);
                    if (geoRes.ok) {
                        const geoData = await geoRes.json();
                        if (geoData.name) {
                            locName = geoData.name;
                            locCountryCode = geoData.country_code || locCountryCode;
                        }
                    }
                } catch (e) {
                    console.warn("Reverse geocoding failed", e);
                }
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
            
            // Update Scene
            if (window.WeatherScene) window.WeatherScene.setActiveLocation('user');
            
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
            
            // Update Scene
            if (window.WeatherScene) window.WeatherScene.setActiveLocation('selected');
            
            // Asynchronously save to DynamoDB via AWS Lambda
            if (weatherData && weatherData.current) {
                const tempStr = `${Math.round(weatherData.current.temperature)}°C`;
                API.saveCloudSearch(locName, tempStr).then(() => {
                    if (window.loadAndRenderCloudHistory) {
                        window.loadAndRenderCloudHistory();
                    }
                });
            }
            
        } catch (error) {
            console.error("Selected Location Error:", error);
            State.selectedLocation.status = 'error';
            UI.setCardState('selected', 'error');
            alert("Failed to fetch weather for selected location.");
        }
    }
};
