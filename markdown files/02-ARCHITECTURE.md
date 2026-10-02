# System Architecture

## 1. High-Level Architecture Overview
Weather Explorer follows a classic Client-Server architecture, but kept intentionally simple. The application is divided into a Vanilla JavaScript SPA (Single Page Application) frontend and a Node.js Express REST API backend.

```text
+-------------------------------------------------+
|                   CLIENT (Browser)              |
|                                                 |
|  +-------------+  +----------+  +------------+  |
|  | DOM / UI    |  | Leaflet  |  | App State  |  |
|  +-------------+  +----------+  +------------+  |
|         ^               |              ^        |
|         |               v              |        |
|  +-------------------------------------------+  |
|  |               Fetch API                   |  |
|  +-------------------------------------------+  |
+-----------------------+-------------------------+
                        | HTTP (JSON)
                        v
+-------------------------------------------------+
|               SERVER (Node.js/Express)          |
|                                                 |
|  +-------------+  +----------+  +------------+  |
|  | /api/weather|  |/api/search| | /api/health|  |
|  +-------------+  +----------+  +------------+  |
|         ^               ^                       |
|         |               |                       |
|  +-------------------------------------------+  |
|  |             Proxy & Validation            |  |
|  +-------------------------------------------+  |
+---------+-----------------------+---------------+
          |                       |
          v                       v
+------------------+    +-------------------+
| Open-Meteo API   |    | Open-Meteo GeoAPI |
| (Weather Data)   |    | (Search Data)     |
+------------------+    +-------------------+
```

## 2. Component Responsibilities

### 2.1. Frontend
- **UI Rendering:** Manipulating the DOM to show weather cards, forecasts, and comparisons.
- **State Management:** A singleton JavaScript object holding `userLocation`, `selectedLocation`, `userWeather`, and `selectedWeather`.
- **Map Integration:** Initializing Leaflet, handling map clicks, dragging markers, and zooming.
- **Geolocation:** Interfacing with the `navigator.geolocation` API.
- **Local Storage:** Saving theme preference and recent searches.

### 2.2. Backend
- **Static File Serving:** Express serves the `public/` directory (HTML, CSS, JS).
- **API Proxy:** Hiding the exact third-party API URLs and standardizing the responses.
- **Data Normalization:** Stripping out unnecessary fields from Open-Meteo responses to send only what the frontend needs.
- **Validation:** Ensuring `latitude` and `longitude` are valid numbers before querying third-party services.

## 3. Directory Structure
```text
weather-explorer/
├── package.json
├── server.js               # Entry point for the backend
├── .gitignore
├── README.md
├── server/
│   ├── routes/             # Express routers
│   │   ├── weather.js      # Handles /api/weather
│   │   └── search.js       # Handles /api/search
│   ├── services/           # Third-party API logic
│   │   ├── weatherService.js
│   │   └── geocodingService.js
│   ├── utils/
│   │   └── validation.js   # Input validation logic
├── public/                 # Frontend assets
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── app.js          # Initialization and state
│   │   ├── map.js          # Leaflet logic
│   │   ├── weather.js      # Weather UI rendering
│   │   ├── search.js       # Search UI and logic
│   │   ├── api.js          # Fetch wrappers for backend calls
│   │   └── utils.js        # Formatting, icon mapping
│   └── assets/             # Icons, images
```

## 4. State Management Concept
Since no framework is used, state will be managed via a central object in `app.js`.

```javascript
const AppState = {
  theme: 'light',
  user: {
    coordinates: null, // { lat, lng }
    weather: null,     // current weather data
    forecast: null     // 5-day forecast data
  },
  selected: {
    name: null,        // City name or 'Map Selected'
    coordinates: null, // { lat, lng }
    weather: null,
    forecast: null
  },
  recentSearches: []
};
```
Whenever state is mutated, dedicated render functions (e.g., `renderUserWeather()`, `updateComparisonTable()`) will be invoked.

## 5. Security & Stability
- The backend will validate all incoming requests to prevent malformed data from reaching Open-Meteo.
- Frontend uses `textContent` strictly when rendering API data to prevent XSS.
- Graceful error handling at both the HTTP layer (returning 400/500 codes) and the UI layer (displaying toast notifications or empty states).
