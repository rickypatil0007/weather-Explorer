# Map & Weather API Integration

## 1. Overview
The core interaction loop of Weather Explorer relies on the interplay between the Leaflet Map and the Open-Meteo Weather API. The map acts as a global visual selector for weather data.

## 2. Leaflet Map Initialization
- **Library:** Leaflet v1.9.4.
- **Tiles:** OpenStreetMap (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`).
- **Attribution:** MUST include `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`.
- **Default View:** Center the map on a global/equator view (e.g., `[20, 0]`) with a zoom level of `2` or `3` before user geolocation resolves.

## 3. Marker Management
The map maintains strictly two markers at any time:
1.  **User Location Marker (`userMarker`):**
    - Distinct visual style (e.g., a blue dot or specific custom icon).
    - Immutable via map clicks (only updates if geolocation is re-requested).
    - Contains a permanent tooltip/popup: "Your Location".
2.  **Selected Location Marker (`selectedMarker`):**
    - Distinct visual style (e.g., a red pin).
    - Created on the first map click or search.
    - Repositioned on subsequent clicks.
    - Draggable property set to `true` (`{ draggable: true }`).

## 4. Interaction Events

### 4.1. Map Click
When the user clicks an empty area on the map:
1.  Listen to map `click` event.
2.  Extract `e.latlng.lat` and `e.latlng.lng`.
3.  If `selectedMarker` exists, use `setLatLng([lat, lng])`. If not, create it.
4.  Trigger `fetchWeather(lat, lng)` for the selected location.

### 4.2. Marker Dragging
To avoid spamming the weather API while the user drags the marker across the screen:
1.  Listen to the marker's `dragend` event (NOT `drag`).
2.  On `dragend`, extract the new coordinates via `marker.getLatLng()`.
3.  Trigger `fetchWeather(lat, lng)`.

## 5. Viewport and Zoom Management
- When a user searches for a city, the map should `flyTo` or `setView` to the new coordinates.
- Calculate appropriate zoom level based on the search context (usually zoom level `10` or `12` is good for a city).
- Do not automatically change the zoom level on a simple map click; let the user control the zoom.

## 6. Optimization Rules
- **No Background Polling:** The map does not update data on an interval. It strictly updates on user action.
- **Deduplication:** If the user clicks the exact same pixel (coordinates match existing state), do not trigger a fetch.

## 7. Example Leaflet Snippet
```javascript
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let selectedMarker;

map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    if (selectedMarker) {
        selectedMarker.setLatLng([lat, lng]);
    } else {
        selectedMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
        
        selectedMarker.on('dragend', function(event) {
            const marker = event.target;
            const position = marker.getLatLng();
            handleLocationSelection(position.lat, position.lng);
        });
    }
    handleLocationSelection(lat, lng);
});
```
