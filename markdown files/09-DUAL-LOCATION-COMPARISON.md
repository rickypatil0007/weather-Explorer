# DUAL LOCATION COMPARISON SPECIFICATION
## Weather Explorer

### 1. Concept
The core differentiator of this application is the ability to view two locations simultaneously without one overwriting the other. This requires a specific UI layout and strict state management.

### 2. State Requirements
The `state` object must maintain separate properties:
```javascript
const state = {
  userWeather: null,     // Data for Location 1
  selectedWeather: null  // Data for Location 2
};
```
When `state.selectedWeather` updates, it must never mutate `state.userWeather`.

### 3. Visual Layout
**Desktop View:**
- The two weather cards can sit side-by-side below the map.
- The comparison table spans the width below the cards.

**Mobile View:**
- Stack the cards vertically: "Your Location" first, "Selected Location" second.
- The comparison table follows.

### 4. The Comparison Table
A strictly formatted section designed to highlight differences.

**Structure:**
- **Rows:** Weather metrics (Temperature, Feels Like, Humidity, Wind Speed, Pressure, Visibility).
- **Column 1:** Metric Name.
- **Column 2:** Value for "Your Location".
- **Column 3:** Value for "Selected Location".

**Handling Missing Data:**
- If the user denied Geolocation, Column 2 ("Your Location") should display a friendly placeholder like "Location not provided" or simply display dashes (`--`) for the values.
- The table must not break if only one location's data is present.

### 5. (Optional but Recommended) "Swap" Feature
A button that reverses the roles of the two locations.
- **Action:** Swaps `state.userWeather` with `state.selectedWeather` and swaps their respective map markers.
- **Benefit:** Allows a user to set a new baseline location if they don't want to use their physical GPS location as the primary point of comparison.
