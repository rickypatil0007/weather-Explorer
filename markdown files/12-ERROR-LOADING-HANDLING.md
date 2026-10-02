# ERROR & LOADING HANDLING
## Weather Explorer

### 1. The Importance of Feedback
In a network-dependent application, data fetch times vary, and requests can fail. The UI must always communicate the current system status to the user. Blank screens or silent failures are unacceptable.

### 2. Loading States
**When to show:**
- During initial geolocation detection.
- While fetching weather for the user's location.
- While fetching weather after a map click or marker drag.
- While searching for a city.

**How to show:**
- Disable interactive elements (e.g., disable the search button while searching).
- Use CSS spinners, skeleton loaders, or changing text (e.g., "Fetching weather..." -> "Done").
- Do NOT block the entire screen with an overlay. Localize the loading indicator to the specific card or section being updated.

### 3. Error States
**Types of Errors & Responses:**
- **Geolocation Denied/Timeout:** 
  - UI Response: Display a persistent, non-intrusive banner or update the "Your Location" card to say: "Location access denied. Please use the map or search."
- **Search API Fails (or 0 results):**
  - UI Response: Show inline text below the search bar: "No results found for that city."
- **Weather API Fails (e.g., 500 Server Error):**
  - UI Response: Inside the affected weather card, display: "Weather data currently unavailable. [Retry Button]".
- **Network Offline:**
  - UI Response: Listen to `window.addEventListener('offline', ...)` and show a global banner indicating the app has lost internet connection.

### 4. Implementation Guidelines (JavaScript)
Always use `try/catch` blocks within `async/await` functions.

```javascript
async function fetchWeather(lat, lon) {
  showLoading('selected-card');
  try {
    const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    updateStateAndUI(data);
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    showError('selected-card', 'Failed to load weather data.');
  } finally {
    hideLoading('selected-card');
  }
}
```
