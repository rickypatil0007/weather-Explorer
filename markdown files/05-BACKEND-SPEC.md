# BACKEND SPECIFICATION
## Weather Explorer

### 1. Technology Stack
- **Environment:** Node.js
- **Framework:** Express.js
- **Dependencies:** `express`, `cors` (if serving frontend separately, though serving static from Express is preferred), `axios` or native `fetch` (Node 18+) for external API calls.

### 2. Core Responsibilities
1. **Static File Serving:** Serve the `public/` directory (HTML, CSS, JS).
2. **API Proxy:** Safely make requests to Open-Meteo, preventing CORS issues and keeping any future secrets (if added) off the frontend.
3. **Data Normalization:** Filter the massive JSON responses from Open-Meteo into lean, specific payloads for the frontend.
4. **Caching:** Implement basic in-memory caching to respect Open-Meteo's rate limits.

### 3. API Endpoints

#### GET `/api/health`
- **Purpose:** Verification that the server is running.
- **Response:** `{ "status": "ok", "service": "weather-explorer" }`

#### GET `/api/weather`
- **Query Params:** `lat` (number), `lon` (number).
- **Action:** 
  1. Validate params.
  2. Check cache for this lat/lon block.
  3. Fetch from `https://api.open-meteo.com/v1/forecast...`.
  4. Normalize data.
- **Response Shape:**
  ```json
  {
    "current": {
      "temperature": 28,
      "feelsLike": 30,
      "conditionCode": 3,
      "humidity": 75,
      ...
    },
    "forecast": [
      { "date": "2023-10-25", "maxTemp": 29, "minTemp": 22, ... },
      ...
    ]
  }
  ```

#### GET `/api/search`
- **Query Params:** `q` (string, the city name).
- **Action:** 
  1. Validate param.
  2. Fetch from `https://geocoding-api.open-meteo.com/v1/search?name=X`.
  3. Normalize data.
- **Response Shape:**
  ```json
  {
    "results": [
      { "name": "Tokyo", "country": "Japan", "lat": 35.68, "lon": 139.69 },
      ...
    ]
  }
  ```

### 4. Error Handling
- Return proper HTTP status codes (`400 Bad Request` for missing params, `500 Internal Server Error` if Open-Meteo is down).
- Send JSON error messages: `{ "error": "Invalid latitude or longitude provided." }`.
