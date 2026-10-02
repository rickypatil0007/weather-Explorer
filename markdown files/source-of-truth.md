# WEATHER EXPLORER

## Single Source of Truth — Complete Project Build Specification

## 1. PROJECT IDENTITY

Project name:

**Weather Explorer — Dual Location Weather & Map-Based Weather Comparison**

Academic topic:

**Weather App with Geolocation — Detects user location and fetches weather automatically**

The application is a free, public, no-login weather web application.

The core idea:

1. Automatically detect and display the user's current location.
2. Display weather for the user's current location.
3. Provide an interactive world map.
4. Let the user click a second location on the map.
5. Place a second marker at that location.
6. Fetch and display weather for the selected map location.
7. Keep both weather cards visible simultaneously.
8. Allow the user to change the selected map location at any time.
9. Allow searching for a city/location and use that as the second location.
10. Provide a clear side-by-side comparison between the two locations.

The project must feel like a polished real web application, but it must remain simple enough for a first-year JavaScript/IP assignment.

---

# 2. NON-NEGOTIABLE TECHNOLOGY REQUIREMENTS

## Frontend

Use ONLY:

* HTML5
* CSS3
* Vanilla JavaScript

Do NOT use:

* React
* Next.js
* Vue
* Angular
* Svelte
* Tailwind CSS
* Bootstrap
* Material UI
* shadcn
* frontend frameworks
* frontend component libraries

The frontend must demonstrate actual HTML, CSS and JavaScript knowledge.

## Backend

Use:

* Node.js
* Express.js
* Vanilla JavaScript

The backend must be written in JavaScript.

Do NOT use:

* Python
* FastAPI
* Django
* PHP
* Java Spring
* Firebase
* Supabase
* MongoDB
* PostgreSQL
* authentication systems
* user accounts

No database is required.

---

# 3. ZERO-LOGIN REQUIREMENT

There must be:

* NO login page
* NO signup
* NO authentication
* NO password
* NO account creation
* NO dashboard requiring an account
* NO database

The website opens directly to the Weather Explorer application.

The entire application must be usable immediately.

---

# 4. API REQUIREMENTS

Use free APIs only.

## Weather API

Use Open-Meteo.

Primary endpoint:

`https://api.open-meteo.com/v1/forecast`

Weather data must be requested using:

* latitude
* longitude

Use the API to obtain at minimum:

* current temperature
* apparent/feels-like temperature
* relative humidity
* wind speed
* wind direction
* weather code
* precipitation
* visibility
* pressure
* sunrise
* sunset

Also obtain a short forecast.

The application should display a practical 5-day forecast rather than overwhelming the user with raw API data.

Open-Meteo's forecast API supports coordinate-based weather requests and daily/hourly weather variables, while its service currently states that no API key or sign-up is required for non-commercial use.

## Geocoding API

Use Open-Meteo Geocoding for location/city search.

Endpoint:

`https://geocoding-api.open-meteo.com/v1/search`

Search should return:

* place name
* latitude
* longitude
* country
* administrative region
* timezone where available

Do NOT implement an aggressive autocomplete system.

The user should type a location and explicitly submit/search it.

Open-Meteo's geocoding endpoint supports searching cities/postal codes and returns coordinates and location metadata.

## Map

Use:

* Leaflet
* OpenStreetMap map tiles

Use Leaflet 1.9.4 unless a later stable version is specifically verified before implementation.

Leaflet supports:

* interactive maps
* map click events
* markers
* draggable markers
* touch interaction

Use the official OpenStreetMap tile URL:

`https://tile.openstreetmap.org/{z}/{x}/{y}.png`

Always show visible:

`© OpenStreetMap contributors`

Do not implement offline map downloads, bulk tile prefetching, or aggressive tile requests. Follow OpenStreetMap's tile usage policy.

---

# 5. HIGH-LEVEL APPLICATION FLOW

```text
                    OPEN WEBSITE
                         |
                         v
                Initialize Application
                         |
             +-----------+-----------+
             |                       |
             v                       v
      Initialize Map          Request Location
                                     |
                           +---------+---------+
                           |                   |
                         Allowed             Denied
                           |                   |
                           v                   v
                   Get Coordinates      Show friendly message
                           |
                           v
                   Weather API Request
                           |
                           v
                CURRENT LOCATION CARD
```

Meanwhile:

```text
USER CLICKS MAP
      |
      v
Read latitude + longitude
      |
      v
Move / create selected marker
      |
      v
Request weather for selected coordinates
      |
      v
SELECTED LOCATION CARD
      |
      v
Update comparison section
```

Search flow:

```text
User enters city
      |
      v
Submit search
      |
      v
Node backend -> Open-Meteo Geocoding
      |
      v
Return matching locations
      |
      v
User selects result
      |
      v
Map moves to location
      |
      v
Selected marker updates
      |
      v
Weather request
      |
      v
Selected-location card updates
```

---

# 6. MAIN UI

The application should have one main page.

Recommended structure:

```text
---------------------------------------------------------
                 WEATHER EXPLORER
       Weather at your location + anywhere
---------------------------------------------------------

[ Search a city or location... ] [ Search ]

[ 📍 Use My Location ]

---------------------------------------------------------
|                                               |
|                 INTERACTIVE MAP               |
|                                               |
|       🔵 Your Location                        |
|                                               |
|                          🔴 Selected Location  |
|                                               |
|     Zoom controls                             |
|                                               |
---------------------------------------------------------

YOUR LOCATION
---------------------------------------------------------
Mumbai, Maharashtra
Current Location

        28°C
        Clear Sky

Feels like 30°C

Humidity       75%
Wind           14 km/h
Pressure       1012 hPa
Visibility     8 km

Sunrise        06:20
Sunset         18:18
---------------------------------------------------------

SELECTED LOCATION
---------------------------------------------------------
Tokyo, Japan
Map Selected

        19°C
        Light Rain

Feels like 18°C

Humidity       82%
Wind           11 km/h
Pressure       1008 hPa
Visibility     7 km

Sunrise        05:36
Sunset         17:25
---------------------------------------------------------

                 WEATHER COMPARISON

             YOUR LOCATION | SELECTED
Temperature      28°C     |   19°C
Humidity          75%     |   82%
Wind             14 km/h  |   11 km/h
Condition        Clear    |   Rain

---------------------------------------------------------

                 5-DAY FORECAST
---------------------------------------------------------
Day 1 | Day 2 | Day 3 | Day 4 | Day 5
---------------------------------------------------------
```

---

# 7. MAP BEHAVIOUR

The map is one of the most important features.

## Marker 1 — User Location

Use a visually distinct marker for the user's location.

Label:

**Your Location**

The marker must remain associated with the detected user location.

## Marker 2 — Selected Location

Use a different visual marker.

Label:

**Selected Location**

When the user clicks somewhere on the map:

1. Read latitude.
2. Read longitude.
3. Move the selected marker there.
4. Fetch weather for those coordinates.
5. Update the selected-location weather card.
6. Update the comparison section.

When the user clicks somewhere else:

1. Do NOT create unlimited markers.
2. Reuse the existing selected marker.
3. Move it to the new coordinates.
4. Fetch new weather.
5. Update the UI.

The map must remain clean.

---

# 8. DRAGGABLE SELECTED MARKER

The selected marker should be draggable.

Behaviour:

```text
Drag RED marker
       |
       v
Marker stops at new coordinates
       |
       v
Get new latitude/longitude
       |
       v
Request new weather
       |
       v
Update selected location
```

Do NOT call the weather API continuously while the marker is being dragged.

Only request weather after `dragend`.

This avoids unnecessary API calls.

---

# 9. USER LOCATION

Use the browser's Geolocation API.

Expected flow:

```javascript
navigator.geolocation.getCurrentPosition(...)
```

On success:

* obtain latitude
* obtain longitude
* put the user marker on the map
* center the map
* fetch weather
* populate the user weather card

On failure:

Do not break the application.

Show:

**“We couldn't access your location. You can still select any location from the map or search for a city.”**

The map must continue working.

---

# 10. LOCATION SEARCH

Search bar example:

```text
[ Search for a city... ]
```

Example input:

```text
Tokyo
```

Backend sends search to Open-Meteo Geocoding.

Display a small result panel:

```text
Search results

Tokyo
Tokyo, Japan
35.6762° N, 139.6503° E

Tokyo
Tokyo, Japan
...
```

Clicking a result:

1. Set selected location.
2. Move selected marker.
3. Center map.
4. Zoom map appropriately.
5. Fetch weather.
6. Update selected card.
7. Update comparison.

Do not build continuous API-powered autocomplete.

---

# 11. LOCATION NAME HANDLING

For the user's GPS coordinates, use whatever meaningful location metadata is available from the implementation.

For map clicks that do not correspond to a searched city, the application must still work.

Fallback format:

```text
Selected Location

Lat: 19.0760
Long: 72.8777
```

Do NOT allow lack of a city name to break weather functionality.

For searched locations, use the geocoding result's location name, administrative region and country.

---

# 12. WEATHER CARD

Each location card should include:

### Identity

* Location name
* Country
* State/region if available
* Local time
* Timezone

### Main weather

* Large temperature
* Weather condition
* Weather icon
* Feels-like temperature

### Weather statistics

* Humidity
* Wind speed
* Wind direction
* Pressure
* Visibility
* Precipitation

### Sun information

* Sunrise
* Sunset

Use clear icons and labels.

Do not display raw JSON.

---

# 13. WEATHER CONDITION MAPPING

Convert Open-Meteo weather codes into human-readable conditions.

Create a single reusable JavaScript function:

```text
weatherCode -> condition + icon
```

Examples:

```text
Clear
Mainly Clear
Partly Cloudy
Cloudy
Fog
Drizzle
Rain
Heavy Rain
Snow
Thunderstorm
```

The condition mapping must live in one place.

Do NOT duplicate the same mapping in multiple files.

---

# 14. FORECAST

Show a clean 5-day forecast.

Each day:

```text
Thursday

☀️
28°C / 23°C

Rain: 10%
```

Include:

* day
* weather icon
* max temperature
* min temperature
* precipitation probability

The forecast should exist for both locations.

---

# 15. WEATHER COMPARISON

The application should have a dedicated comparison component.

Example:

```text
                 WEATHER COMPARISON

                    YOU        SELECTED

Temperature        28°C          19°C
Feels Like         30°C          18°C
Humidity            75%           82%
Wind                14 km/h       11 km/h
Pressure            1012 hPa      1008 hPa
Visibility            8 km          7 km
```

Do not declare one location "better."

This is a weather comparison, not a recommendation system.

---

# 16. RESPONSIVE DESIGN

Desktop:

```text
Map + Weather information
```

Tablet:

```text
Map
Weather cards
Comparison
```

Mobile:

```text
Header
Search
Map
Your Location Card
Selected Location Card
Comparison
Forecast
```

The website must work properly on:

* desktop
* laptop
* tablet
* mobile

No horizontal scrolling.

---

# 17. VISUAL DESIGN

Make the project look significantly better than a basic classroom weather app.

Style direction:

**Modern weather dashboard**

Use:

* clean typography
* glass/card styling used carefully
* subtle gradients
* rounded cards
* soft shadows
* weather-related background treatment
* clear hierarchy
* strong spacing
* animated loading states
* smooth hover effects
* responsive layout

Do not make it excessively flashy.

Do not use:

* huge animated backgrounds that hurt readability
* excessive particle effects
* unnecessary 3D
* gimmicky animations
* fake AI features

The professor should immediately understand the application.

---

# 18. LIGHT/DARK MODE

Add a simple theme toggle.

Button:

```text
☀ Light / 🌙 Dark
```

Save the preference in:

```text
localStorage
```

No account is needed.

---

# 19. RECENT LOCATIONS

Optional but recommended.

Store only a small list in:

```text
localStorage
```

Example:

```text
Recent locations

Tokyo
London
Delhi
Pune
```

Clicking a recent location should load it again.

Maximum:

5 locations.

Do not create a database.

---

# 20. LOADING STATES

Every network operation must have a visible loading state.

Examples:

```text
Detecting your location...
```

```text
Loading weather...
```

```text
Searching locations...
```

Buttons should not appear broken while waiting.

---

# 21. ERROR HANDLING

The application must gracefully handle:

### Geolocation denied

Show:

```text
Location access was denied.
You can still choose a location from the map.
```

### Weather API failure

Show:

```text
Weather data is temporarily unavailable.
Please try again.
```

### Search returns nothing

Show:

```text
No matching locations found.
Try another city or country.
```

### Network offline

Show:

```text
You're offline.
Please check your internet connection.
```

### Invalid coordinates

Reject invalid latitude/longitude before sending the request.

### Backend failure

Frontend must show an understandable message rather than a blank screen.

---

# 22. API CALL OPTIMIZATION

Do not make unnecessary API requests.

Rules:

* User GPS -> one weather request.
* Map click -> one weather request after click.
* Marker drag -> request only on dragend.
* Search -> one geocoding request after explicit submission.
* Selected search result -> one weather request.
* Avoid duplicate requests for unchanged coordinates.
* Prevent accidental request spam.
* Add basic in-memory backend caching for repeated identical weather requests where appropriate.

Do not continuously refresh weather every few seconds.

A manual:

**Refresh Weather**

button is enough.

---

# 23. BACKEND API DESIGN

Create a simple Express server.

Recommended routes:

```text
GET /api/health
GET /api/weather?latitude=...&longitude=...
GET /api/search?name=...
```

## `/api/health`

Response:

```json
{
  "status": "ok",
  "service": "weather-explorer"
}
```

## `/api/weather`

Validate:

```text
latitude
longitude
```

Then call Open-Meteo.

Return only the normalized data required by the frontend.

Do NOT send unnecessary raw API payloads.

Example response:

```json
{
  "location": {
    "latitude": 19.076,
    "longitude": 72.8777,
    "timezone": "Asia/Kolkata"
  },
  "current": {
    "temperature": 28,
    "feelsLike": 30,
    "humidity": 75,
    "windSpeed": 14,
    "windDirection": 220,
    "pressure": 1012,
    "visibility": 8,
    "weatherCode": 1
  },
  "daily": []
}
```

## `/api/search`

Input:

```text
name
```

Backend calls Open-Meteo Geocoding.

Return normalized search results.

---

# 24. FRONTEND/BACKEND RESPONSIBILITY

Frontend:

* UI
* map
* browser geolocation
* DOM manipulation
* event handling
* state management
* localStorage
* displaying API responses

Backend:

* external weather API requests
* external geocoding API requests
* input validation
* error normalization
* simple caching
* API proxy layer

Do not put the entire application logic into the backend.

Do not make the frontend dependent on a database.

---

# 25. PROJECT STRUCTURE

Use a clean structure similar to:

```text
weather-explorer/
│
├── package.json
├── server.js
├── README.md
├── .gitignore
│
├── server/
│   ├── routes/
│   │   ├── weather.js
│   │   └── search.js
│   │
│   ├── services/
│   │   ├── weatherService.js
│   │   └── geocodingService.js
│   │
│   ├── utils/
│   │   ├── validation.js
│   │   └── cache.js
│   │
│   └── config/
│       └── constants.js
│
└── public/
    ├── index.html
    │
    ├── css/
    │   ├── style.css
    │   └── responsive.css
    │
    ├── js/
    │   ├── app.js
    │   ├── map.js
    │   ├── weather.js
    │   ├── geolocation.js
    │   ├── search.js
    │   ├── storage.js
    │   └── utils.js
    │
    └── assets/
        └── ...
```

The exact structure may be simplified if it improves maintainability, but keep frontend and backend clearly separated.

---

# 26. PACKAGE REQUIREMENTS

Keep dependencies minimal.

Required:

```text
express
```

For development:

```text
nodemon
```

Leaflet can be loaded from its official CDN.

Do not introduce unnecessary npm packages.

---

# 27. SECURITY / CODE QUALITY

Even though this is a student project:

* validate query parameters
* sanitize user-provided text before inserting into DOM
* prefer `textContent` over unsafe `innerHTML` for untrusted values
* handle failed fetch requests
* use async/await
* use try/catch
* return meaningful HTTP status codes
* keep constants centralized
* avoid duplicated code
* avoid global variables where unnecessary

Never expose server internals to the browser.

---

# 28. NO SECRETS REQUIREMENT

Do not require API keys.

Do not create:

```text
WEATHER_API_KEY
OPENWEATHER_API_KEY
MAP_API_KEY
GOOGLE_MAPS_KEY
```

The application must work immediately after:

```text
npm install
npm start
```

Open-Meteo currently provides its basic weather API without authentication/sign-up for non-commercial use.

---

# 29. MAP ATTRIBUTION

The map must visibly contain:

```text
© OpenStreetMap contributors
```

Do not remove or hide it.

Do not preload large areas or implement offline map downloads.

OpenStreetMap's standard tile service is donation-funded and has specific usage requirements, including visible attribution and restrictions on bulk/preemptive tile downloading.

---

# 30. MAIN JAVASCRIPT STATE

Maintain a simple application state object.

Conceptually:

```javascript
const state = {
  userLocation: null,
  selectedLocation: null,
  userWeather: null,
  selectedWeather: null,
  recentLocations: []
};
```

The UI should derive from application state rather than having unrelated variables everywhere.

---

# 31. STARTUP BEHAVIOUR

When the page loads:

1. Render the complete interface.
2. Initialize the map.
3. Set a sensible world/default map center.
4. Add map controls.
5. Attempt browser geolocation.
6. If geolocation succeeds:

   * set user marker
   * center map on user
   * fetch user weather
7. Keep map selection available even if geolocation fails.
8. Do not block the entire application while geolocation is pending.

---

# 32. MAP DEFAULT

Use a sensible initial global view.

After the user's location is detected:

```text
map.setView(userLocation, appropriateZoom)
```

Do not zoom so close that the map becomes unusable.

After a searched location is selected:

```text
pan / flyTo selected location
```

Use smooth map transitions.

---

# 33. IMPORTANT DUAL-LOCATION RULE

This is a core requirement:

**Never replace Location 1 with Location 2.**

Location 1:

```text
YOUR LOCATION
```

Location 2:

```text
SELECTED LOCATION
```

Example:

```text
YOUR LOCATION
Mumbai, India
28°C

SELECTED LOCATION
London, UK
12°C
```

Changing the map location changes ONLY the selected location.

The user's original location remains available.

---

# 34. OPTIONAL "SWAP LOCATIONS"

Add a button:

```text
↔ Swap
```

It swaps the visual roles of the two locations.

This is optional, but recommended if implemented cleanly.

Do not let swapping destroy or duplicate location data.

---

# 35. REFRESH BUTTON

Add:

```text
↻ Refresh Weather
```

It refreshes weather for both currently loaded locations.

Do not refresh map tiles unnecessarily.

---

# 36. ACCESSIBILITY

Include:

* semantic HTML
* labels
* accessible buttons
* keyboard-friendly controls
* visible focus states
* meaningful `aria-label`s where needed
* sufficient text contrast
* responsive controls

Map controls must remain usable on smaller screens.

---

# 37. PROFESSOR DEMO FLOW

The application should be demonstrable in approximately 2–3 minutes.

Recommended demo:

### Step 1

Open the site.

Show automatic detection:

```text
Your Location → Mumbai → Current Weather
```

### Step 2

Point to the map.

Say:

> “The second location can be selected directly from the interactive map.”

### Step 3

Click somewhere else.

Example:

```text
Tokyo
```

The second weather card updates.

### Step 4

Drag the selected marker.

Show that the weather changes after dragend.

### Step 5

Search another city.

Example:

```text
London
```

Select it.

Map moves to London and selected weather updates.

### Step 6

Show:

```text
Mumbai vs London
```

in the comparison section.

This demonstrates:

* HTML
* CSS
* JavaScript
* browser geolocation
* Node.js backend
* REST APIs
* `fetch()`
* JSON
* DOM manipulation
* map integration
* event handling
* localStorage
* responsive design

---

# 38. DEFINITION OF DONE

The project is complete only when all of the following work:

[ ] Website opens without login.

[ ] Frontend uses only HTML/CSS/vanilla JavaScript.

[ ] Backend uses Node.js/Express/JavaScript.

[ ] Map renders correctly.

[ ] OpenStreetMap attribution is visible.

[ ] Browser location can be requested.

[ ] User location marker appears.

[ ] User weather loads.

[ ] User weather card is displayed.

[ ] User can click the map.

[ ] Selected marker appears.

[ ] Selected weather loads.

[ ] Both weather cards remain visible.

[ ] User can drag selected marker.

[ ] Weather updates after dragend.

[ ] User can search a location.

[ ] Search results appear.

[ ] Selecting a search result moves the map.

[ ] Search result weather loads.

[ ] Comparison section updates.

[ ] 5-day forecast works.

[ ] Loading states work.

[ ] Error states work.

[ ] Dark/light mode works.

[ ] Recent locations work through localStorage.

[ ] No database exists.

[ ] No authentication exists.

[ ] No paid API key is required.

[ ] No hardcoded secret is required.

[ ] No framework is used on the frontend.

[ ] No Python backend exists.

[ ] `npm install` works.

[ ] `npm start` starts the application.

[ ] No console-breaking errors remain.

[ ] No broken buttons remain.

[ ] Mobile layout works.

---

# 39. IMPLEMENTATION PRIORITY

Build in this exact order:

### Phase 1 — Foundation

* Node.js
* Express
* static frontend serving
* project structure
* `/api/health`

### Phase 2 — Basic Weather

* `/api/weather`
* Open-Meteo integration
* weather normalization

### Phase 3 — Geolocation

* browser geolocation
* user marker
* user weather card

### Phase 4 — Map

* Leaflet
* OpenStreetMap tiles
* selected marker
* map click

### Phase 5 — Dual Weather

* selected weather
* second card
* comparison

### Phase 6 — Search

* `/api/search`
* search UI
* map movement
* selected weather

### Phase 7 — Forecast

* 5-day forecast
* both locations

### Phase 8 — Polish

* responsive CSS
* dark mode
* recent locations
* loading states
* error handling
* animations
* accessibility

Do not build advanced features before the core weather flow works.

---

# 40. IMPORTANT DEVELOPMENT RULE

Do not overengineer this project.

The goal is:

**simple architecture + polished execution + demonstrable JavaScript concepts.**

Do not add:

* authentication
* database
* admin panel
* AI chatbot
* payment systems
* unnecessary microservices
* complex state libraries
* frontend frameworks
* unnecessary npm dependencies

Every added feature must have a clear educational or usability purpose.

---

# 41. FINAL PRODUCT VISION

The final application should feel like:

**“A lightweight, interactive weather explorer where I can compare my current weather with weather anywhere on Earth.”**

The primary experience is:

```text
             YOUR LOCATION
                    +
            MAP LOCATION PICKER
                    +
              LIVE WEATHER
                    +
               COMPARISON
```

The application should be polished enough to demonstrate during an IP/JavaScript practical, while the code remains understandable to a first-year student.

---

# 42. README REQUIREMENTS

Create a README containing:

* project title
* project objective
* features
* technology stack
* architecture
* API sources
* setup instructions
* folder structure
* how geolocation works
* how map selection works
* how dual weather comparison works
* screenshots section placeholder
* limitations
* credits/attribution

Clearly state that the map uses OpenStreetMap and the weather/geocoding data comes from Open-Meteo.

---

# 43. FINAL INSTRUCTION TO THE CODING AGENT

Treat this document as the **single source of truth**.

Do not change the project concept.

Do not replace the required technologies with frameworks.

Do not add authentication.

Do not add a database.

Do not require paid services.

Do not invent API keys.

Do not remove the dual-location feature.

Do not reduce the project to a basic single-location weather app.

The finished application MUST have:

**automatic user location + interactive map + second selected location + weather for both locations + comparison + search + forecast.**

Build the simplest reliable implementation that satisfies every requirement above, then polish the UI without compromising clarity or maintainability.
