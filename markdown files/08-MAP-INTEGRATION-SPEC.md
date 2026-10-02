# MAP INTEGRATION SPECIFICATION
## Weather Explorer

### 1. Library & Provider
- **Library:** Leaflet.js (Version 1.9.4+ recommended via CDN).
- **Tile Provider:** OpenStreetMap.
- **Tile URL:** `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Attribution:** MUST include `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`.

### 2. Map Initialization
- **Container:** An HTML `div` with a specific `id` (e.g., `map`) and a fixed or responsive height via CSS.
- **Default View:** If geolocation is pending or denied, initialize the map at a zoomed-out global view (e.g., `[20, 0]`, zoom level `2`).
- **Options:** Disable double-click zoom if it interferes with marker placement, but standard zoom controls must remain accessible.

### 3. Markers Architecture
The application uses exactly TWO markers. Do not spawn new markers on every click.

**Marker 1: User Location (Blue)**
- Created only if Geolocation succeeds.
- Static (non-draggable).
- Represents `state.userLocation`.

**Marker 2: Selected Location (Red)**
- Created on first map click or first search selection.
- Draggable (`draggable: true`).
- Represents `state.selectedLocation`.

### 4. Interaction Events
**Map Click:**
- `map.on('click', function(e) { ... })`
- Extract `e.latlng.lat` and `e.latlng.lng`.
- Move "Selected Location" marker to these coordinates.
- Trigger Weather API fetch.

**Marker Drag:**
- `marker.on('dragend', function(e) { ... })`
- Wait until the user finishes dragging.
- Extract new coordinates from the marker position.
- Trigger Weather API fetch.

### 5. Movement and Transitions
- When a user searches for a city, use `map.flyTo([lat, lng], zoomLevel)` for a smooth transition to the new location.
- Appropriate zoom levels:
  - Global view: `2`
  - City level (after search): `10` to `12`
  - Street level: (Not necessary for this app, max zoom should be capped).
