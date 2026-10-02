# STATE MANAGEMENT
## Weather Explorer

### 1. The Central Source of Truth
Because this project does not use React, Vue, or Redux, maintaining synchronization between the UI and the data requires a disciplined approach to state. We will use a single JavaScript object to act as the central source of truth.

### 2. State Object Definition
```javascript
const state = {
  userLocation: {
    lat: null,
    lon: null,
    name: "Your Location" // Will be updated if geocoding data is available
  },
  selectedLocation: {
    lat: null,
    lon: null,
    name: "Map Selected"
  },
  userWeather: null,      // Stores normalized API response
  selectedWeather: null,  // Stores normalized API response
  recentSearches: [],     // Array of objects { name, lat, lon }
  theme: 'light'          // 'light' or 'dark'
};
```

### 3. State Mutation Rules
- **Never mutate the DOM directly before mutating state.**
- **Flow:** User Action -> Update State -> Trigger UI Render Function.

Example of bad practice:
```javascript
// BAD
document.getElementById('temp').textContent = newTemp;
```

Example of good practice:
```javascript
// GOOD
function updateSelectedWeather(weatherData) {
  state.selectedWeather = weatherData;
  renderSelectedWeatherCard();
  renderComparisonTable();
}

function renderSelectedWeatherCard() {
  const data = state.selectedWeather;
  if (!data) return;
  document.getElementById('selected-temp').textContent = `${data.current.temperature}°C`;
  // ... update other fields
}
```

### 4. Persistence
- `state.theme` and `state.recentSearches` should be saved to `localStorage` every time they are updated.
- On app initialization, these values should be read from `localStorage` to rehydrate the state before the initial render.
