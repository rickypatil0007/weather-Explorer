# Frontend Specification

## 1. Technologies
- **HTML5:** Semantic markup (`<header>`, `<main>`, `<section>`, `<article>`).
- **CSS3:** Custom Properties (variables), Flexbox, CSS Grid, media queries. NO external CSS frameworks.
- **Vanilla JavaScript:** ES6+ syntax (`const`, `let`, arrow functions, template literals, `async/await`, destructuring).

## 2. UI Layout & Structure
The layout is a dashboard style interface.

### 2.1 Header
- Logo / App Title.
- Search Bar (Input + Submit Button).
- Theme Toggle Button (Light/Dark).

### 2.2 Main Content Area (Grid Layout)
- **Top Row / Left Column:** Interactive Leaflet Map. Takes up significant visual space. Includes a "Use My Location" overlay button.
- **Top Row / Right Column:** Location Weather Cards.
  - Card 1: YOUR LOCATION
  - Card 2: SELECTED LOCATION
- **Bottom Row:** 
  - Weather Comparison Section (Side-by-side tabular comparison).
  - 5-Day Forecast section for both locations.

## 3. CSS Styling Strategy
- **CSS Variables:** Define color palettes, typography, spacing, and border-radiuses in `:root`.
- **Themes:** 
  ```css
  :root {
    --bg-color: #f4f7f6;
    --card-bg: #ffffff;
    --text-primary: #333333;
    /* ... */
  }
  [data-theme="dark"] {
    --bg-color: #121212;
    --card-bg: #1e1e1e;
    --text-primary: #f5f5f5;
  }
  ```
- **Glassmorphism:** Use `backdrop-filter: blur(10px)` and semi-transparent backgrounds for floating elements to give a modern, premium feel.
- **Animations:** Smooth transitions on hover (`transform: translateY(-2px)`), soft fade-ins for loading weather data (`animation: fadeIn 0.3s ease-in`).

## 4. JavaScript Modules & Logic

### `app.js`
- Handles `DOMContentLoaded`.
- Initializes the state.
- Orchestrates the startup sequence (Init map -> request geolocation -> fetch weather).
- Ties together DOM events.

### `map.js`
- Encapsulates Leaflet initialization.
- Manages the two markers (`userMarker`, `selectedMarker`).
- Exposes functions like `setMapCenter(lat, lng)`, `updateSelectedMarker(lat, lng)`, `onMapClick(callback)`, and `onMarkerDragEnd(callback)`.

### `weather.js`
- Handles DOM updates for the weather cards and comparison section.
- `renderUserCard(weatherData)`
- `renderSelectedCard(weatherData)`
- `updateComparison(userWeather, selectedWeather)`

### `api.js`
- Centralizes `fetch` calls to the Node.js backend.
- `async fetchWeather(lat, lng)`
- `async fetchSearch(query)`
- Includes basic `try/catch` and returns normalized JSON or throws errors.

### `utils.js`
- `mapWeatherCodeToIcon(code)`: Returns the correct emoji or SVG icon path based on WMO weather codes.
- `formatTime(isoString)`: Formats sunrise/sunset times.
- `debounce(func, timeout)`: Used for preventing rapid-fire clicks.

## 5. Event Handling
- **Search Form Submit:** Prevents default, triggers `api.fetchSearch()`, updates map and selected location.
- **Map Click:** Extracts lat/lng, moves selected marker, triggers `api.fetchWeather()`, updates UI.
- **Marker Drag End:** Similar to Map Click, triggers fetch and updates UI.
- **Theme Toggle Click:** Toggles `data-theme` attribute on the `<html>` tag and saves to localStorage.
- **Refresh Button Click:** Re-runs the weather fetch for both existing coordinate pairs.

## 6. Loading and Error States
- **Loading:** Display skeleton screens or spinner overlays inside the weather cards while `fetch` is pending. Disable buttons during network requests.
- **Errors:** Show an inline alert or toast notification (e.g., "Failed to fetch weather. Please try again.") without breaking the layout.
