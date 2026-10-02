# WEATHER API INTEGRATION SPECIFICATION
## Weather Explorer

### 1. Provider
**Open-Meteo Forecast API**
- **Endpoint:** `https://api.open-meteo.com/v1/forecast`
- **Auth:** None required for non-commercial use.
- **Rate Limit:** 10,000 calls per day.

### 2. Request Configuration
The Node.js backend must construct the URL with the following query parameters to fetch exactly what is needed for the UI.

**Required Parameters:**
- `latitude`: (from frontend)
- `longitude`: (from frontend)
- `current_weather`: true
- `hourly`: temperature_2m,relativehumidity_2m,apparent_temperature,windspeed_10m,winddirection_10m,surface_pressure,visibility (to extract current stats)
- `daily`: weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max
- `timezone`: auto (to return times relative to the location requested)

*Note: Open-Meteo's specific parameter names frequently update; always refer to their interactive documentation to generate the exact query string.*

### 3. Weather Condition Code Mapping
Open-Meteo returns WMO Weather interpretation codes (e.g., `0`, `1`, `61`). The frontend (or backend normalization layer) MUST map these to human-readable text and emoji/icons.

**Standard Mapping Requirement:**
- `0`: Clear sky (☀️)
- `1, 2, 3`: Mainly clear, partly cloudy, and overcast (⛅/☁️)
- `45, 48`: Fog and depositing rime fog (🌫️)
- `51, 53, 55`: Drizzle (🌧️)
- `61, 63, 65`: Rain (🌧️)
- `71, 73, 75`: Snow fall (❄️)
- `95, 96, 99`: Thunderstorm (⛈️)

### 4. Data Extraction Rules
- **Current Temperature:** Take directly from `current_weather.temperature`.
- **Sunrise/Sunset:** Take from `daily.sunrise[0]` and `daily.sunset[0]`.
- **Forecast:** Iterate over `daily.time` (indexes 1 through 5) to build the 5-day forecast array, avoiding index 0 (today) if the design requires *future* days only.
