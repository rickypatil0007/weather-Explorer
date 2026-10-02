# README Outline

The `README.md` in the root of the repository must be comprehensive and professional. Use this outline to structure it.

## 1. Title & Badges
- **Title:** Weather Explorer
- **Subtitle:** A dual-location interactive weather comparison web application.
- **Badges:** Built with HTML5, CSS3, Vanilla JS, Node.js, Express.

## 2. Project Objective
- Briefly explain the academic context (First-year JS/IP Assignment).
- State the core goal: To demonstrate mastery of native web technologies by building an interactive, API-driven application without relying on heavy frontend frameworks or databases.

## 3. Features
Bullet points highlighting:
- Automatic browser geolocation detection.
- Interactive global map powered by Leaflet.
- "Drag and drop" map pin for weather anywhere on Earth.
- Side-by-side local vs. selected weather comparison.
- Geocoding city search.
- 5-Day forecasts.
- Dark/Light mode theme toggle.
- Zero login / No authentication required.

## 4. Technology Stack
- **Frontend:** HTML5, CSS3 (Custom Properties, Flexbox, Grid), Vanilla JavaScript (ES6+).
- **Backend:** Node.js, Express.js.
- **External APIs:** Open-Meteo (Weather & Geocoding), OpenStreetMap (Tiles).
- **Mapping Library:** Leaflet.js.

## 5. Architecture Overview
- Briefly explain the separation of concerns (SPA frontend talking to Express REST API).
- Explain why the backend acts as a proxy (data normalization, input validation).

## 6. Setup Instructions
Clear, copy-pasteable terminal commands.
```bash
# Clone the repository
git clone https://github.com/username/weather-explorer.git
cd weather-explorer

# Install dependencies
npm install

# Start the server
npm start

# Open in browser
http://localhost:3000
```
Note: Explicitly mention that no API keys or `.env` configurations are required to run the project.

## 7. Folder Structure
Provide a visual tree of the codebase to help reviewers navigate.
```text
weather-explorer/
├── server.js
├── public/          (Frontend Assets)
└── server/          (Backend Routes & Logic)
```

## 8. Technical Highlights (For Evaluators)
- **State Management:** Explain how state is managed in Vanilla JS without React/Vue.
- **API Optimization:** Explain the decision to fetch on `dragend` instead of `drag` to reduce network spam.
- **Security:** Mention using `textContent` for DOM updates to prevent XSS.

## 9. Credits & Attributions
- Map data by © OpenStreetMap contributors.
- Weather data by Open-Meteo.com.
- Icons by [Icon Provider Name].

## 10. Screenshots
Placeholders for:
- Desktop view (Light Mode).
- Desktop view (Dark Mode).
- Mobile responsive view.
