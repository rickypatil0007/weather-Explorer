# FEATURE SPECIFICATION
## Weather Explorer

### 1. Feature: Automatic Geolocation & Local Weather
- **Description:** Upon loading, the app requests the user's GPS coordinates.
- **Inputs:** Browser Geolocation API (`navigator.geolocation`).
- **Outputs:** Latitude and longitude coordinates.
- **Behavior:**
  - If granted: Updates the map, places a "Your Location" marker, fetches weather data, and populates the "Your Location" card.
  - If denied/fails: Fails gracefully, displaying a message that location access was denied, but leaves the rest of the application functional.

### 2. Feature: Interactive Map Explorer
- **Description:** A global map that users can interact with to select locations.
- **Components:** Leaflet map, OpenStreetMap tiles.
- **Behavior:**
  - Displays a default global view or centers on the user's location if available.
  - Clicking anywhere on the map drops a "Selected Location" marker.
  - Translates the click event into lat/long coordinates to fetch weather data for the selected point.
  - Marker is draggable; fetching new data only upon `dragend` to optimize API calls.

### 3. Feature: Location Search (Geocoding)
- **Description:** A text-based search to find specific cities or regions.
- **Inputs:** User text input.
- **Outputs:** A list of matching locations from the Open-Meteo Geocoding API.
- **Behavior:**
  - User submits a query (no aggressive autocomplete).
  - Backend proxies the request to Open-Meteo.
  - UI displays a list of results (City, State, Country, Coordinates).
  - Clicking a result updates the map's selected marker, re-centers the map, and fetches weather for that location.

### 4. Feature: Dual Weather Display
- **Description:** Two distinct weather cards visible simultaneously.
- **Card 1: Your Location** (Fixed to user's GPS, or hidden/defaulted if denied).
- **Card 2: Selected Location** (Updates based on map clicks or search).
- **Data Points per Card:**
  - Location Name/Timezone
  - Current Temperature & Condition (with icon)
  - Feels-like Temperature
  - Humidity, Wind Speed/Direction, Pressure, Visibility
  - Sunrise/Sunset times.

### 5. Feature: Weather Comparison Table
- **Description:** A side-by-side tabular view comparing the two locations.
- **Metrics Compared:** Temperature, Feels Like, Humidity, Wind, Pressure, Visibility.
- **Behavior:** Automatically updates whenever either location's weather data changes.

### 6. Feature: 5-Day Forecast
- **Description:** A brief outlook for the next 5 days for both locations.
- **Data Points:** Day name, Weather icon, Max Temp, Min Temp, Precipitation probability.

### 7. Feature: Theme Toggle & State Persistence
- **Description:** Light/Dark mode and recent searches.
- **Storage:** `localStorage`.
- **Behavior:** Remembers the user's preferred theme and up to 5 recently searched locations across sessions.

### 6. Apple-Inspired UI/UX Features
- **Global Scene Resolver:** A unified function `resolveWeatherScene(weatherData, localTime)` that outputs a scene state (e.g., `clear-night`, `rain-day`). Applies to the main `#weather-scene` background container.
- **Hourly Forecast:** A horizontally scrollable row showing 24-hour data. Includes a toggle for Conditions / Rain / Wind.
- **10-Day Forecast:** Expands the original 5-day forecast to 10 days, fetching max/min temp and precip probability.
- **Weather Details Grid:** Displays Humidity, Feels Like, Wind Speed/Direction, Pressure, Visibility, UV Index, Sunrise, Sunset.
- **Air Quality Section:** Uses Open-Meteo AQI API to show AQI index, PM2.5, and PM10.
- **Map Layers:** UI toggles on the map for Standard, Temperature, Precipitation, Wind, and Air Quality visual overlays.

