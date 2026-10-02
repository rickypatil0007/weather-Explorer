# TESTING & ACCEPTANCE CRITERIA
## Weather Explorer

### 1. Overview
As a student project, automated testing (Jest, Cypress) is not strictly required unless specified by the professor. However, thorough manual QA testing against the Source of Truth is mandatory before final submission.

### 2. Acceptance Criteria Checklist

#### General UI/UX
- [ ] Application loads without errors in the browser console.
- [ ] No login/authentication screen exists.
- [ ] "Your Location" and "Selected Location" cards are both visible.
- [ ] Comparison table is visible.
- [ ] Theme toggle (Light/Dark) successfully switches styles.
- [ ] Refreshing the page preserves the chosen Theme.

#### Geolocation Flow
- [ ] Upon load, browser prompts for location.
- [ ] Accepting location places the blue marker on the map correctly.
- [ ] Accepting location populates the "Your Location" weather card.
- [ ] Denying location shows a graceful fallback message in the "Your Location" card.
- [ ] Denying location does not break the rest of the application (map/search still work).

#### Map & Selected Location Flow
- [ ] Clicking a random spot on the map places/moves the red marker.
- [ ] Clicking the map populates/updates the "Selected Location" weather card.
- [ ] Dragging the red marker and releasing it updates the "Selected Location" card.
- [ ] "Your Location" card is NEVER overwritten by map clicks.
- [ ] Comparison table updates correctly when map is clicked.

#### Search Flow
- [ ] Typing a city and submitting search displays results.
- [ ] Clicking a search result moves the red marker, pans the map, and updates the "Selected Location" weather.
- [ ] Searching a non-existent location displays a friendly "Not Found" error instead of crashing.

#### Backend
- [ ] `npm start` successfully boots the server on the defined port.
- [ ] Navigating to `/api/health` in the browser returns the correct JSON status.
- [ ] The OpenStreetMap tiles load correctly (proving no CORS issues).
- [ ] API keys are NOT hardcoded in the frontend or backend (proving adherence to the free/no-auth rule).

### 3. Edge Cases to Test
- Extremely fast repeated clicking on the map (should not crash the server; frontend should handle gracefully).
- Mobile layout on a physical phone or browser DevTools emulator (ensure no horizontal scrolling).
- Loss of internet connection mid-session.
