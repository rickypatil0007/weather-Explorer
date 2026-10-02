# Implementation Roadmap

Building this project iteratively ensures stability. Do not skip phases or jump to advanced styling before the core logic works.

## Phase 1: Foundation (Backend & Setup)
**Goal:** A working server that serves a blank HTML page and health endpoint.
1. Run `npm init -y`.
2. Install dependencies: `npm install express`, `npm install -D nodemon`.
3. Create `server.js` and setup a basic Express app.
4. Create the `public/` directory with `index.html`, `css/style.css`, and `js/app.js`.
5. Implement `GET /api/health`.
6. Add "start" and "dev" scripts in `package.json`.

## Phase 2: Weather API Proxy (Backend)
**Goal:** The Node.js server can successfully talk to Open-Meteo and normalize the response.
1. Create `server/routes/weather.js`.
2. Write the logic to accept `latitude` and `longitude` query params.
3. Make the fetch call to `api.open-meteo.com/v1/forecast`.
4. Parse the raw JSON and map it to a clean JavaScript object.
5. Return the normalized object to the client.
6. Test using Postman or browser (e.g., `localhost:3000/api/weather?latitude=52.52&longitude=13.41`).

## Phase 3: Map & Geolocation (Frontend)
**Goal:** Render the map and pinpoint the user.
1. Include Leaflet CSS and JS via CDN in `index.html`.
2. Initialize the map in `public/js/map.js` to a default global view.
3. In `app.js`, invoke `navigator.geolocation.getCurrentPosition`.
4. On success, add the `userMarker` to the map.
5. Pan the map to the user's coordinates.

## Phase 4: Connecting the Dots (Frontend <-> Backend)
**Goal:** Fetch weather based on the detected location.
1. Create `public/js/api.js` with a wrapper `fetchWeather(lat, lng)`.
2. Call this wrapper once geolocation succeeds.
3. Build the "YOUR LOCATION" weather card HTML structure.
4. Write DOM manipulation logic in `weather.js` to populate the card with the fetched JSON.

## Phase 5: Map Interactions
**Goal:** Clicking the map fetches weather for a second location.
1. Add a `click` event listener to the Leaflet map object.
2. Extract coordinates and instantiate `selectedMarker` (or `setLatLng` if it exists).
3. Call `fetchWeather` for the new coordinates.
4. Build the "SELECTED LOCATION" weather card and populate it.
5. Ensure "YOUR LOCATION" is not overwritten.
6. Make `selectedMarker` draggable and listen to `dragend`.

## Phase 6: Search Feature
**Goal:** Users can find cities by typing.
1. Build `GET /api/search` in the backend linking to Open-Meteo Geocoding.
2. Build the search input UI.
3. Wire the submit event to fetch from `/api/search`.
4. Display a simple list of results.
5. On click, update `selectedMarker` and trigger `fetchWeather`.

## Phase 7: Comparison & Forecast
**Goal:** Expand the data display.
1. Build the HTML table/grid for the side-by-side comparison.
2. Write a function that accepts both `userWeather` and `selectedWeather` and updates the DOM table.
3. Build the 5-day forecast UI loop, parsing the `daily` array from the API response.

## Phase 8: Polish & Styling
**Goal:** Make it look like a premium web app.
1. Apply the final CSS variables.
2. Implement Glassmorphism and shadows.
3. Refine typography.
4. Add the Light/Dark mode toggle logic.
5. Implement loading spinners.
6. Final responsive testing (media queries).
