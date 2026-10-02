# GEOCODING API INTEGRATION SPECIFICATION
## Weather Explorer

### 1. Provider
**Open-Meteo Geocoding API**
- **Endpoint:** `https://geocoding-api.open-meteo.com/v1/search`
- **Auth:** None required for non-commercial use.
- **Purpose:** To convert a user-provided city name into geographic coordinates (Latitude & Longitude) so the map can navigate to it and the Weather API can fetch data for it.

### 2. Request Configuration
The Node.js backend (`/api/search`) will construct the request to Open-Meteo.

**Required Parameters:**
- `name`: The city/location name provided by the user.
- `count`: 5 (Limit results to a reasonable number to avoid overwhelming the UI).
- `language`: `en`
- `format`: `json`

### 3. Data Normalization Rule
The Open-Meteo geocoding response includes many fields. The backend MUST filter this down to an array of simplified objects before sending it to the frontend.

**Required Fields per Result:**
- `name`: The city name (e.g., "Tokyo").
- `country`: The country name (e.g., "Japan").
- `admin1`: The state/province, if available.
- `latitude`: Float value.
- `longitude`: Float value.
- `timezone`: The timezone string (e.g., "Asia/Tokyo").

### 4. UI Implementation Details
- **Trigger:** The search request should ONLY fire when the user submits the form (pressing Enter or clicking a Submit button). Do NOT implement continuous "on-type" autocomplete, as this will burn through the API rate limit unnecessarily.
- **Display:** Results should appear in a small dropdown or list below the search bar.
- **Selection:** Clicking a result triggers the Map Update flow and the Weather Fetch flow.
- **Empty State:** If the API returns 0 results, display "No matching locations found. Try another city."
