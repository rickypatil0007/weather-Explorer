# IMPLEMENTATION ROADMAP
## Weather Explorer

### 1. Project Initialization & Architecture (Phase 1)
- **Goal:** Set up the repository, basic server, and file structure.
- **Tasks:**
  - Initialize `npm init -y`.
  - Install `express` and `cors`.
  - Create the directory structure (`server/`, `public/js/`, `public/css/`).
  - Write `server.js` to serve static files on port 3000.
  - Implement the `/api/health` check endpoint.
  - Create the base `index.html` structure.

### 2. Backend API Proxy (Phase 2)
- **Goal:** Safely connect to Open-Meteo without the frontend knowing.
- **Tasks:**
  - Create the `/api/weather` endpoint in Node.js.
  - Make a sample fetch to Open-Meteo using native fetch or Axios.
  - Write a normalization function to map weather codes to text/icons.
  - Format the JSON response specifically for the UI.
  - Implement basic in-memory caching.

### 3. Frontend Geolocation & State (Phase 3)
- **Goal:** Get the user's location and display basic weather.
- **Tasks:**
  - Build `state.js`.
  - Implement `navigator.geolocation` in `app.js`.
  - Handle success (fetch weather from backend) and error (show denial message).
  - Build the HTML/CSS for the "Your Location" weather card.
  - Render the API data into the card.

### 4. Interactive Map Integration (Phase 4)
- **Goal:** Render a global map and allow clicking.
- **Tasks:**
  - Import Leaflet CSS and JS via CDN.
  - Initialize the map on a specific DOM element.
  - Add the OpenStreetMap tile layer (with attribution).
  - Place the Blue marker at `state.userLocation`.
  - Add click listeners to drop/move the Red marker.
  - Trigger backend weather fetch on map click and render the "Selected Location" card.

### 5. Search & Geocoding (Phase 5)
- **Goal:** Allow text-based location finding.
- **Tasks:**
  - Create the `/api/search` proxy endpoint in Node.js.
  - Build the HTML search bar and attach submit listeners.
  - Render a dropdown of results on the frontend.
  - On click, `map.flyTo()` the new coordinates and update the Red marker.

### 6. Comparison & Polish (Phase 6)
- **Goal:** Finalize the dual-view and UI polish.
- **Tasks:**
  - Build the Comparison Table HTML/CSS.
  - Write the logic to populate the table whenever `state` changes.
  - Add the 5-day forecast UI.
  - Implement Theme toggle (Light/Dark mode) and save to LocalStorage.
  - Add loading spinners and error handling.
  - Final QA testing against mobile and desktop layouts.
