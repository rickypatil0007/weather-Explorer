/**
 * Main Application Entry Point
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Init UI (Theme, Event Listeners)
    UI.initTheme();

    // Init Weather Scene Engine
    if (window.WeatherScene) {
        window.WeatherScene.init();
    }

    // 2. Init Map
    MapController.init();

    // 3. Bind Global Events
    
    // My Location Button
    UI.elements.myLocationBtn.addEventListener('click', () => {
        WeatherController.fetchUserLocation();
    });

    // Search Form
    let searchTimeout = null;
    UI.elements.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length < 3) {
            UI.elements.searchResults.classList.add('hidden');
            return;
        }

        // Debounce search
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const results = await API.searchLocations(query);
            renderSearchResults(results);
        }, 500);
    });

    UI.elements.searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = UI.elements.searchInput.value.trim();
        if (query.length >= 3) {
            const results = await API.searchLocations(query);
            if (results.length > 0) {
                const res = results[0];
                const hierarchy = [];
                if (res.admin2) hierarchy.push(res.admin2);
                if (res.admin1) hierarchy.push(res.admin1);
                hierarchy.push(res.country);
                const uniqueHierarchy = [...new Set(hierarchy)].join(', ');
                handleLocationSelection(res, uniqueHierarchy);
            }
        }
    });

    // Close search dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            UI.elements.searchResults.classList.add('hidden');
        }
    });

    // Auto-fetch user location on startup (optional, per source of truth)
    // We will wait for user interaction to avoid immediate prompts as per best practices,
    // or we can just trigger it. Let's trigger it.
    WeatherController.fetchUserLocation();

    // Load AWS Serverless Cloud History from DynamoDB
    loadAndRenderCloudHistory();
});

async function loadAndRenderCloudHistory() {
    const container = document.getElementById('cloud-history-tags');
    if (!container) return;

    try {
        const items = await API.fetchCloudHistory();
        if (!items || items.length === 0) {
            container.innerHTML = '<span class="cloud-loading-text">No cloud records yet. Search any city!</span>';
            return;
        }

        // Sort by timestamp descending
        const sorted = items
            .filter(item => item && item.city)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 6);

        container.innerHTML = sorted.map(item => `
            <button class="cloud-chip" onclick="handleCloudChipClick('${item.city.replace(/'/g, "\\'")}')" title="Click to view ${item.city}">
                <span>📍 ${item.city}</span>
                <span class="cloud-chip-temp">${item.temp || ''}</span>
            </button>
        `).join('');
    } catch (e) {
        container.innerHTML = '<span class="cloud-loading-text">Cloud history offline</span>';
    }
}

window.loadAndRenderCloudHistory = loadAndRenderCloudHistory;

window.handleCloudChipClick = async function(cityName) {
    const cleanCity = cityName.split('(')[0].trim();
    const results = await API.searchLocations(cleanCity);
    if (results && results.length > 0) {
        const res = results[0];
        handleLocationSelection(res, res.country || '');
    }
};

function renderSearchResults(results) {
    const container = UI.elements.searchResults;
    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = '<div class="search-item">No results found</div>';
    } else {
        results.forEach(res => {
            const div = document.createElement('div');
            div.className = 'search-item';
            
            // Build the hierarchy: City, Region, Country
            const hierarchy = [];
            if (res.admin2) hierarchy.push(res.admin2);
            if (res.admin1) hierarchy.push(res.admin1);
            hierarchy.push(res.country);
            // Deduplicate (e.g. if city name == state name) and join
            const uniqueHierarchy = [...new Set(hierarchy)].join(', ');

            div.innerHTML = `
                <div class="search-item-title">${res.name}</div>
                <div class="search-item-desc">${uniqueHierarchy}</div>
            `;
            div.addEventListener('click', () => {
                handleLocationSelection(res, uniqueHierarchy);
            });
            container.appendChild(div);
        });
    }
    
    container.classList.remove('hidden');
}

function handleLocationSelection(locationObj, hierarchyStr) {
    UI.elements.searchResults.classList.add('hidden');
    UI.elements.searchInput.value = locationObj.name;
    
    // Construct a beautiful name for the card: "Kyoto, Japan"
    let locName = locationObj.name;
    if (hierarchyStr) {
        locName += ` (${hierarchyStr})`;
    } else {
        locName += locationObj.admin1 ? `, ${locationObj.admin1}` : '';
    }
    
    WeatherController.fetchSelectedLocation(locationObj.latitude, locationObj.longitude, locName, locationObj.country_code);
}
