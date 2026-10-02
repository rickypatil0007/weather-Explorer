# IMPLEMENTATION CHECKLIST
## Weather Explorer

### Foundation
- [ ] `package.json` created.
- [ ] Express.js installed.
- [ ] `server.js` configured to serve the `public/` directory.
- [ ] `/api/health` endpoint responds successfully.
- [ ] HTML boilerplate created.
- [ ] CSS files linked.

### Backend APIs
- [ ] `/api/weather` endpoint created.
- [ ] Successfully fetches from `api.open-meteo.com/v1/forecast`.
- [ ] Returns normalized JSON object (current + forecast).
- [ ] Implements in-memory caching (e.g., 15 minutes TTL).
- [ ] `/api/search` endpoint created.
- [ ] Successfully fetches from `geocoding-api.open-meteo.com`.
- [ ] Returns normalized search results array.

### Frontend: Geolocation
- [ ] App requests user location on load.
- [ ] Successfully stores Lat/Lng in central `state`.
- [ ] Displays appropriate error message in UI if denied.

### Frontend: UI Rendering
- [ ] "Your Location" weather card built (HTML/CSS).
- [ ] Populates data securely using `textContent`.
- [ ] Weather codes successfully mapped to human-readable text and emojis.
- [ ] "Selected Location" weather card built.
- [ ] Comparison Table built.
- [ ] Comparison Table updates dynamically when state changes.
- [ ] 5-Day Forecast section built and populated.

### Frontend: Map Integration
- [ ] Leaflet map initializes correctly in the DOM.
- [ ] OpenStreetMap tiles load with visible attribution.
- [ ] Blue marker represents User Location.
- [ ] Clicking map creates/moves Red marker.
- [ ] Red marker is draggable.
- [ ] Dropping Red marker updates "Selected Location" weather card.

### Frontend: Search
- [ ] Search input captures user query on submit (no continuous autocomplete).
- [ ] Backend returns valid results.
- [ ] Results populate a dropdown list.
- [ ] Clicking a result moves the map and Red marker.

### Polish & UX
- [ ] Loading spinners display during network requests.
- [ ] Error messages display gracefully on network failure.
- [ ] Light/Dark mode toggle works.
- [ ] Theme preference saves to `localStorage`.
- [ ] Responsive CSS ensures it looks good on mobile devices.
