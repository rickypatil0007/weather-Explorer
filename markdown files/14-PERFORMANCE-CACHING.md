# PERFORMANCE & CACHING
## Weather Explorer

### 1. The Rate Limit Problem
Open-Meteo allows 10,000 calls per day per IP. Since all frontend requests go through our Node.js backend, Open-Meteo sees only the Server's IP. Without caching, 1,000 users searching for "Tokyo" results in 1,000 identical API calls, quickly exhausting the server's limit.

### 2. Backend In-Memory Caching Strategy
We will implement a simple, dependency-free in-memory cache on the Node.js server.

**Concept:**
- Store API responses in a JavaScript `Map` or Object.
- The key should be a combination of rounded coordinates (e.g., `lat_lon`).
- Store a timestamp alongside the data.
- If a request comes in for coordinates that exist in the cache AND the timestamp is less than `X` minutes old, serve the cached data.

**Example Implementation:**
```javascript
const weatherCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

function getCachedWeather(lat, lon) {
  // Round to 2 decimal places (approx 1.1km precision) to increase cache hits
  const key = `${parseFloat(lat).toFixed(2)}_${parseFloat(lon).toFixed(2)}`;
  
  if (weatherCache.has(key)) {
    const entry = weatherCache.get(key);
    if (Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data; // Cache HIT
    } else {
      weatherCache.delete(key); // Cache STALE
    }
  }
  return null; // Cache MISS
}
```

### 3. Frontend Optimizations
- **Debounce / Throttle:** Prevent the user from spamming the "Search" button or dragging the map marker too rapidly. Only trigger the API call on `dragend` for the map marker, not during the `drag` event.
- **Asset Loading:** Load JavaScript at the end of the `<body>` or use `defer` to ensure the DOM is painted first. Load Leaflet's CSS in the `<head>`.
- **Image Optimization:** Use SVG for weather icons where possible, as they scale infinitely and have tiny file sizes.
