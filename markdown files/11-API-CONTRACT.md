# API Contract

This document defines the strict communication contract between the frontend SPA and the backend Express server.

## Base URL
All internal endpoints are prefixed with `/api`.
Base URL in development: `http://localhost:3000/api`

---

## 1. Health Check

**Endpoint:** `GET /health`  
**Description:** Verifies the backend server is running.

**Request Parameters:** None

**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "weather-explorer"
}
```

---

## 2. Weather Fetch

**Endpoint:** `GET /weather`  
**Description:** Retrieves current weather and a 5-day forecast for a specific geographic coordinate. The backend handles querying Open-Meteo and normalizes the payload.

**Query Parameters:**
- `latitude` (Required, Float): e.g., `19.076`
- `longitude` (Required, Float): e.g., `72.8777`

**Response (200 OK):**
```json
{
  "location": {
    "latitude": 19.076,
    "longitude": 72.8777,
    "timezone": "Asia/Kolkata"
  },
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
      "weatherCode": 1,
      "maxTemp": 31,
      "minTemp": 24,
      "precipitationProb": 0,
      "sunrise": "2023-10-27T06:20",
      "sunset": "2023-10-27T18:18"
    }
    // ... 4 more days
  ]
}
```

**Error Responses:**
- `400 Bad Request`: If lat/lng are missing or invalid.
- `502 Bad Gateway`: If the upstream Open-Meteo API fails.

---

## 3. Location Search (Geocoding)

**Endpoint:** `GET /search`  
**Description:** Resolves a text string (city name) into geographic coordinates.

**Query Parameters:**
- `name` (Required, String): e.g., `Tokyo`

**Response (200 OK):**
```json
[
  {
    "id": 1850147,
    "name": "Tokyo",
    "latitude": 35.6895,
    "longitude": 139.6917,
    "country": "Japan",
    "admin1": "Tokyo"
  },
  {
    "id": 1850144,
    "name": "Tokyo",
    "latitude": 35.6895,
    "longitude": 139.6917,
    "country": "Japan",
    "admin1": "Tokyo"
  }
]
```
*(Array contains up to 5 results)*

**Error Responses:**
- `400 Bad Request`: If `name` is missing.
- `502 Bad Gateway`: If the upstream Geocoding API fails.
