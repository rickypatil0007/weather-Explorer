# Testing & Acceptance Criteria

## 1. Definition of Done
A feature is complete when it is fully integrated, styled according to the modern design specifications, throws no console errors, handles edge cases gracefully, and passes all acceptance criteria below.

## 2. Acceptance Criteria by Feature

### 2.1. Basic Architecture & Hosting
- [ ] **AC:** Running `npm install` followed by `npm start` successfully boots the Express server on port 3000 (or `.env` defined).
- [ ] **AC:** Opening `http://localhost:3000` serves the `index.html` without 404 errors for CSS or JS assets.
- [ ] **AC:** `GET /api/health` returns a 200 OK JSON response.

### 2.2. Map Integration
- [ ] **AC:** The map renders within the allocated grid space on page load.
- [ ] **AC:** The OpenStreetMap attribution is clearly visible in the bottom corner of the map.
- [ ] **AC:** The user can zoom in and out using mouse scroll or map controls.

### 2.3. Geolocation & User Location Card
- [ ] **AC:** The browser prompts for geolocation on initial load.
- [ ] **AC:** If granted, a marker labeled "Your Location" appears at the correct coordinates.
- [ ] **AC:** The map centers on these coordinates.
- [ ] **AC:** The "YOUR LOCATION" weather card displays accurate data (Temp, Humidity, etc.) for the current location.
- [ ] **AC:** If geolocation is denied, a polite error message is shown, and the application does not crash.

### 2.4. Map Click & Selected Location Card
- [ ] **AC:** Clicking anywhere on the map places a "Selected Location" marker.
- [ ] **AC:** The "SELECTED LOCATION" weather card populates with weather for that specific lat/lng.
- [ ] **AC:** Clicking a different map location moves the existing marker (does not create a duplicate).
- [ ] **AC:** The "YOUR LOCATION" card data is preserved and not overwritten.

### 2.5. Marker Dragging
- [ ] **AC:** The "Selected Location" marker can be dragged.
- [ ] **AC:** No API calls are made *during* the drag.
- [ ] **AC:** Exactly one API call is made when the drag completes (`dragend`).

### 2.6. Search Functionality
- [ ] **AC:** Searching a valid city name (e.g., "Paris") returns a list of matching locations.
- [ ] **AC:** Clicking a result moves the map and the selected marker to Paris.
- [ ] **AC:** The "SELECTED LOCATION" card updates to show Paris weather.
- [ ] **AC:** The search input handles empty submissions gracefully without throwing errors.

### 2.7. Comparison & Forecast Sections
- [ ] **AC:** The Comparison table correctly aligns Location 1 and Location 2 data side-by-side.
- [ ] **AC:** The 5-Day forecast displays data for 5 subsequent days with max/min temps and icons.

### 2.8. UI/UX and Responsiveness
- [ ] **AC:** The layout adapts to mobile devices (stacked layout) without horizontal scrolling.
- [ ] **AC:** Light/Dark theme toggles instantly and persists across page reloads via `localStorage`.
- [ ] **AC:** Network loading states are visible when waiting for API responses.

## 3. Manual Testing Scenarios to Execute
1.  **The "No-GPS" Test:** Block location permissions in the browser, reload, and verify the app remains fully usable via search and map clicks.
2.  **The "Ocean" Test:** Click in the middle of the Pacific Ocean. Ensure the API handles it (usually returning weather based on coordinates) and doesn't crash if a city name is missing.
3.  **The "Spam" Test:** Rapidly click the map 10 times in 2 seconds. Ensure the application doesn't freeze (debounce implemented).
4.  **The "Mobile" Test:** Open Chrome DevTools, toggle Device Toolbar to iPhone 12, and verify readability and map usability.
