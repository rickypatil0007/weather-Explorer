/**
 * Map Integration using Leaflet (Phase 5 Placeholder / Base Init)
 */
const MapController = {
    map: null,
    userMarker: null,
    selectedMarker: null,

    init() {
        // Define world bounds
        const southWest = L.latLng(-89.98155760646617, -180);
        const northEast = L.latLng(89.99346179538875, 180);
        const bounds = L.latLngBounds(southWest, northEast);

        // Initialize map centered at [20, 0] with zoom 2 (global view)
        this.map = L.map('map-container', {
            maxBounds: bounds,
            maxBoundsViscosity: 1.0,
            minZoom: 2
        }).setView([20, 0], 2);
        
        this.map.attributionControl.setPrefix(false);

        // Mapbox Streets tiles (Premium English map)
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
                    maxZoom: 19,
                    minZoom: 2,
                    noWrap: true,
                    bounds: bounds,
                    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>',
                    accessToken: data.mapboxToken
                }).addTo(this.map);
            })
            .catch(err => console.error('Failed to load map config', err));

        // Map Click Event
        this.map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            // Fetch weather for clicked coordinates. Name as coordinates.
            WeatherController.fetchSelectedLocation(lat, lng, `${lat.toFixed(2)}, ${lng.toFixed(2)}`);
        });

        // Listen for state changes
        on('userLocationLoaded', (data) => {
            this.updateUserMarker(data.lat, data.lon);
            // If no selected marker yet, center on user
            if (!this.selectedMarker) {
                this.map.setView([data.lat, data.lon], 10);
            }
        });

        on('selectedLocationLoaded', (data) => {
            this.updateSelectedMarker(data.lat, data.lon, data.name);
            this.map.setView([data.lat, data.lon], 10);
        });
    },

    updateUserMarker(lat, lon) {
        if (this.userMarker) {
            this.userMarker.setLatLng([lat, lon]);
        } else {
            // Blue marker for user
            this.userMarker = L.circleMarker([lat, lon], {
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.8,
                radius: 8
            }).addTo(this.map).bindPopup("Your Location");
        }
    },

    updateSelectedMarker(lat, lon, name) {
        if (this.selectedMarker) {
            this.selectedMarker.setLatLng([lat, lon]).setPopupContent(name || "Selected Location");
        } else {
            // Standard pin for selected
            this.selectedMarker = L.marker([lat, lon]).addTo(this.map).bindPopup(name || "Selected Location");
        }
        this.selectedMarker.openPopup();
    }
};
