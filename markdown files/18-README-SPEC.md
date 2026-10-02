# README SPECIFICATION
## Weather Explorer

### 1. Standard README.md Structure
The final project must include a standard `README.md` at the root of the repository. This is critical for academic evaluation.

### 2. Required Sections

#### Title & Description
- **Title:** Weather Explorer
- **Tagline:** A dual-location weather comparison app built with Vanilla JavaScript and Node.js.
- **Description:** A short paragraph explaining that the app detects the user's location, provides an interactive global map, and allows side-by-side comparison of local weather versus any global location.

#### Features
A bulleted list of core functionalities:
- Automatic Geolocation.
- Interactive Leaflet map integration.
- Dual weather tracking and side-by-side comparison.
- 5-Day Forecast.
- Search functionality via Geocoding.
- Dark/Light Mode.

#### Technologies Used
Explicitly state the stack to prove adherence to project rules:
- **Frontend:** HTML5, CSS3, Vanilla ES6 JavaScript (No frameworks).
- **Backend:** Node.js, Express.js.
- **APIs:** Open-Meteo (Weather & Geocoding), OpenStreetMap.
- **Mapping:** Leaflet.js.

#### Setup Instructions
Provide exact commands for the evaluator to run the project:
```bash
# Clone the repository
git clone <repo-url>
cd weather-explorer

# Install dependencies
npm install

# Start the server
npm start
```
State that the app will be available at `http://localhost:3000`. Emphasize that **NO API KEYS or databases are required.**

#### Folder Structure
A brief tree diagram showing the separation of `server/` and `public/`.

#### Architecture Summary
A short explanation of how the Node.js backend acts as a proxy to Open-Meteo to prevent CORS issues and manage caching, while the Vanilla JS frontend handles DOM manipulation and Leaflet integration.

#### Attributions
Mandatory section giving credit to the open-source tools:
- Weather data provided by Open-Meteo.
- Map data © OpenStreetMap contributors.
- Icons by [Author/Source, if applicable].
