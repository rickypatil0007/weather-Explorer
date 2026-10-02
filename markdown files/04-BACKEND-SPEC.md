# Backend Specification

## 1. Technologies
- **Runtime:** Node.js
- **Framework:** Express.js
- **Dependencies:** 
  - `express` (Routing and HTTP server)
  - `cors` (Optional, depending on static serving strategy, but good for decoupling)
  - `node-fetch` or native `fetch` (for Node 18+) to call external APIs.

## 2. Server Configuration
- The Express app will serve static files from the `/public` directory.
- `app.use(express.static('public'))`
- Middleware to parse JSON: `app.use(express.json())`
- Standard port configuration: `const PORT = process.env.PORT || 3000;`

## 3. API Routes

### 3.1 `GET /api/health`
- **Purpose:** Simple health check.
- **Response:**
  ```json
  {
    "status": "ok",
    "service": "weather-explorer",
    "timestamp": "2023-10-27T10:00:00.000Z"
  }
  ```

### 3.2 `GET /api/weather`
- **Purpose:** Fetch current weather and 5-day forecast for given coordinates.
- **Query Parameters:** `latitude` (float), `longitude` (float).
- **Validation:** Ensure both are present and castable to numbers.
- **Upstream Call:** Open-Meteo Forecast API.
  - Endpoint: `https://api.open-meteo.com/v1/forecast`
  - Params: `latitude`, `longitude`, `current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m`, `daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max`, `timezone=auto`.
- **Response Normalization:**
  - Strip the deep nesting of Open-Meteo and return a clean object.
  ```json
  {
    "current": {
      "temperature": 28,
      "feelsLike": 30,
      "humidity": 75,
      "windSpeed": 14,
      "windDirection": 220,
      "pressure": 1012,
      "visibility": 8,
      "weatherCode": 1
    },
    "daily": [
      {
        "date": "2023-10-27",
        "maxTemp": 31,
        "minTemp": 24,
        "weatherCode": 2,
        "precipitationProb": 10,
        "sunrise": "2023-10-27T06:20",
        "sunset": "2023-10-27T18:18"
      }
      // ... up to 5 days
    ]
  }
  ```

### 3.3 `GET /api/search`
- **Purpose:** Geocode a city name to coordinates.
- **Query Parameters:** `name` (string).
- **Validation:** Ensure `name` is present and > 2 characters.
- **Upstream Call:** Open-Meteo Geocoding API.
  - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
  - Params: `name`, `count=5`, `language=en`, `format=json`.
- **Response Normalization:**
  ```json
  [
    {
      "name": "Tokyo",
      "latitude": 35.6895,
      "longitude": 139.6917,
      "country": "Japan",
      "admin1": "Tokyo"
    }
  ]
  ```

## 4. Error Handling
- Wrap upstream fetch calls in `try/catch`.
- If Open-Meteo is down, return HTTP `502 Bad Gateway` with a JSON error message.
- If input validation fails, return HTTP `400 Bad Request` with details.
- Use a centralized error handling middleware in Express.

## 5. Security & Optimization
- **Rate Limiting (Optional but recommended):** Implement basic in-memory throttling to prevent abuse, although it's a student project, it's good practice.
- **In-Memory Cache:** Create a simple `Map` to cache `/api/weather` results based on rounded lat/lng (e.g., to 2 decimal places) for 5 minutes. This severely reduces calls to Open-Meteo for repeated clicks in the same city.
