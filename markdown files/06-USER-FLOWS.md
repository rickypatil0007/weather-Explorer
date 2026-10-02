# User Flows

## 1. Initial Application Load (Happy Path)
1. User navigates to the application URL.
2. The UI renders immediately with an empty map and placeholders for weather cards.
3. The browser prompts the user for Location Permissions.
4. User clicks "Allow".
5. Application receives coordinates from `navigator.geolocation`.
6. Map `setView` moves to the user's coordinates with an appropriate zoom (e.g., 12).
7. `userMarker` is placed on the map.
8. Application calls `/api/weather?latitude=X&longitude=Y`.
9. The "YOUR LOCATION" card is populated with the fetched data.
10. The 5-day forecast for "Your Location" is rendered.

## 2. Geolocation Denied (Alternate Path)
1. User navigates to the application URL.
2. The browser prompts for Location Permissions.
3. User clicks "Deny" or "Block".
4. Application catches the Geolocation error.
5. An inline message is displayed: "Location access denied. You can still choose a location from the map or use search."
6. Map remains at the default global view.
7. "YOUR LOCATION" card remains in a default "Not Available" state.

## 3. Selecting a Location via Map Click
1. User clicks on a location (e.g., somewhere in Brazil) on the map.
2. Map triggers a `click` event.
3. `selectedMarker` is instantiated (or moved) to the clicked coordinates.
4. Application calls `/api/weather?latitude=A&longitude=B`.
5. The "SELECTED LOCATION" card transitions to a loading state.
6. Data is returned from the backend.
7. The "SELECTED LOCATION" card is populated.
8. The "WEATHER COMPARISON" section is updated to compare Location 1 and Location 2.
9. The 5-day forecast section updates to show both locations.

## 4. Selecting a Location via Search
1. User focuses the search input and types "Tokyo".
2. User clicks "Search" (or presses Enter).
3. Application validates input and calls `/api/search?name=Tokyo`.
4. A dropdown or inline list appears below the search bar with results (e.g., "Tokyo, Japan").
5. User clicks the first result.
6. The dropdown closes.
7. Map calls `flyTo` the coordinates of Tokyo.
8. `selectedMarker` moves to Tokyo.
9. Application calls `/api/weather?latitude=TokyoLat&longitude=TokyoLng`.
10. The "SELECTED LOCATION" card updates with Tokyo weather.
11. Comparison and Forecast sections update.
12. "Tokyo" is added to the "Recent Locations" list in `localStorage`.

## 5. Marker Dragging
1. User clicks and holds the `selectedMarker`.
2. User drags the marker to a nearby city.
3. User releases the mouse button (`dragend` event).
4. Application reads new coordinates.
5. Application calls `/api/weather` for the new coordinates.
6. Selected weather card updates.

## 6. Theme Toggle
1. User clicks the "Dark Mode" button.
2. JavaScript sets `document.documentElement.setAttribute('data-theme', 'dark')`.
3. Application saves `{ theme: 'dark' }` to `localStorage`.
4. CSS immediately updates colors based on the new variable scope.

## 7. Error Flow: Network Offline
1. User loses internet connection.
2. User clicks the map.
3. `fetch` call fails.
4. Application catches the error in `api.js`.
5. UI displays a toast notification: "Network error. Please check your connection."
6. Existing weather data remains on screen; no layout breakage occurs.
