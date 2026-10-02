# USER FLOWS
## Weather Explorer

### 1. Initialization Flow (Happy Path)
1. User opens the application URL.
2. Static HTML/CSS loads. Map renders in default global view.
3. Browser prompts: "Allow this site to access your location?"
4. User clicks "Allow".
5. Geolocation API returns Latitude `X`, Longitude `Y`.
6. Frontend updates map: drops Blue marker at `X, Y`, zooms to city level.
7. Frontend calls `/api/weather?lat=X&lon=Y`.
8. Backend fetches from Open-Meteo, normalizes, returns data.
9. Frontend renders the "Your Location" weather card and populates the comparison table.

### 2. Initialization Flow (Denied Geolocation)
1. User opens the application URL.
2. Browser prompts for location. User clicks "Deny" or timeout occurs.
3. Frontend catches error.
4. UI displays: "Location access was denied. You can still choose a location from the map or search."
5. Map remains in default global view.
6. "Your Location" card shows an empty/placeholder state.
7. User is free to click the map or search to populate the "Selected Location" card.

### 3. Map Exploration Flow
1. User clicks anywhere on the Leaflet map.
2. Frontend captures coordinates `A, B`.
3. If Red marker exists, move it to `A, B`. If not, create it.
4. UI shows loading spinner in the "Selected Location" card.
5. Frontend calls `/api/weather?lat=A&lon=B`.
6. Backend processes and returns data.
7. Frontend removes loading spinner, renders data in "Selected Location" card.
8. Comparison table updates automatically to compare "Your Location" (if exists) vs. new "Selected Location".

### 4. Search Flow
1. User clicks the search input and types "Paris".
2. User clicks "Search" (or presses Enter).
3. UI shows a brief loading state near the search bar.
4. Frontend calls `/api/search?q=Paris`.
5. Backend returns an array of matching locations (e.g., Paris, France; Paris, Texas).
6. Frontend displays dropdown/list of results.
7. User clicks "Paris, France".
8. Map fires `flyTo` animation to Paris coordinates.
9. Red marker is placed/moved to Paris.
10. System automatically triggers the Map Exploration Flow (Step 4 onwards) using the new coordinates.
