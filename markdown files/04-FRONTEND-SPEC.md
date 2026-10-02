# FRONTEND SPECIFICATION
## Weather Explorer

### 1. Technology Stack
- **HTML:** Semantic HTML5 structure.
- **CSS:** CSS3 with CSS Variables for theming (Light/Dark mode). Flexbox and Grid for layout. No external CSS frameworks.
- **JavaScript:** ES6+ Vanilla JavaScript. No bundlers (Webpack/Vite) required for this specific academic scope, though ES modules (`<script type="module">`) are recommended for code organization.

### 2. Directory Structure (public/)
```text
public/
├── index.html
├── css/
│   ├── style.css         # Main layout, resets, variables
│   └── components.css    # Cards, buttons, map container styles
└── js/
    ├── app.js            # Main initialization
    ├── state.js          # Centralized state management
    ├── api.js            # Fetch calls to the Node backend
    ├── map.js            # Leaflet initialization and marker logic
    ├── weather.js        # DOM updates for weather cards
    └── ui.js             # Theme toggling, loading spinners, errors
```

### 3. Layout Breakdown
- **Header:** Title, Search Bar, "Use My Location" button, Theme Toggle.
- **Map Section:** Full-width or large centered container for the Leaflet map.
- **Weather Panel (Grid/Flex):**
  - Left/Top: "Your Location" Card.
  - Right/Bottom: "Selected Location" Card.
- **Comparison Section:** A table or grid spanning below the weather cards.
- **Forecast Section:** 5-day forecast cards below the comparison.

### 4. DOM Manipulation Rules
- **Security:** Use `element.textContent` for all textual data received from APIs to prevent XSS. Avoid `innerHTML` unless absolutely necessary (e.g., rendering known SVG icons).
- **Efficiency:** Cache DOM elements in variables if they are updated frequently (e.g., `const tempElement = document.getElementById('temp-selected');`).

### 5. UI/UX Guidelines
- **Loading States:** Show a spinner or skeleton loader inside weather cards while data is fetching.
- **Error States:** Display inline error messages within the specific component (e.g., if search fails, show error below search bar, not as a blocking alert).
- **Responsiveness:** Use CSS Grid for the layout to easily stack the Map, Cards, and Comparison table on mobile screens.
