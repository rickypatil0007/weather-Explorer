# Implementation Checklist

This granular checklist ensures no requirement from the source of truth is missed during development.

## 1. Project Setup
- [ ] Initialize `package.json`.
- [ ] Install `express`.
- [ ] Create `server.js`.
- [ ] Setup `public/` directory with `index.html`, `css/style.css`, `js/app.js`.
- [ ] Verify `npm start` runs the server.

## 2. Backend API
- [ ] **GET `/api/health`** implemented and returns `{ "status": "ok" }`.
- [ ] **GET `/api/weather`** route created.
- [ ] Validates `latitude` and `longitude`.
- [ ] Constructs correct Open-Meteo URL.
- [ ] Normalizes JSON output (extracts only needed fields).
- [ ] Handles external API errors (Try/Catch).
- [ ] **GET `/api/search`** route created.
- [ ] Validates `name` parameter.
- [ ] Constructs correct Open-Meteo Geocoding URL.
- [ ] Normalizes and returns array of locations.

## 3. Frontend: HTML & CSS Structure
- [ ] `index.html` structure (Header, Map Container, Cards Container, Comparison Container).
- [ ] Leaflet CDN CSS & JS linked in `<head>`.
- [ ] Core CSS variables defined (colors, fonts).
- [ ] Mobile-first CSS layout (Grid/Flexbox).
- [ ] Dark Mode CSS variables (`[data-theme="dark"]`).

## 4. Frontend: JavaScript Core
- [ ] State object defined in `app.js`.
- [ ] Wrapper functions in `api.js` (`fetchWeather`, `fetchSearch`).
- [ ] DOM utility functions created (`updateElementText`, `showLoading`, `hideLoading`).
- [ ] Weather icon mapper function implemented.

## 5. Feature: Map Integration
- [ ] Map initializes on load.
- [ ] OpenStreetMap tiles configured.
- [ ] Map click listener implemented.
- [ ] Extracts lat/lng and moves `selectedMarker`.
- [ ] `selectedMarker` configured as `{ draggable: true }`.
- [ ] `dragend` listener triggers weather fetch.

## 6. Feature: User Geolocation
- [ ] `navigator.geolocation.getCurrentPosition` called on load.
- [ ] Map pans to user location on success.
- [ ] `userMarker` added to map.
- [ ] Weather API called for user coordinates.
- [ ] "YOUR LOCATION" UI populated.
- [ ] Graceful UI fallback if permission denied.

## 7. Feature: Search
- [ ] Search form submit event intercepted (prevent default).
- [ ] Calls `/api/search`.
- [ ] Renders dropdown/list of results.
- [ ] Clicking a result moves map and updates `selectedMarker`.
- [ ] Updates "SELECTED LOCATION" weather UI.

## 8. Feature: Dual Comparison & Forecast
- [ ] Comparison table updates when either user or selected weather changes.
- [ ] 5-Day forecast container loops over `daily` array and renders UI blocks.

## 9. Polish & Review
- [ ] Loading states added to cards.
- [ ] Theme toggle button wired up.
- [ ] Theme preference saves to `localStorage`.
- [ ] Map attribution is visible.
- [ ] No API keys in code.
- [ ] No frontend frameworks used.
- [ ] Code is formatted and commented.
