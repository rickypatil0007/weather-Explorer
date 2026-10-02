/**
 * Global State Management
 * Follows the Single Source of Truth architecture.
 */
const State = {
    theme: 'light',
    
    // Location 1 (User Location - Fixed)
    userLocation: {
        latitude: null,
        longitude: null,
        name: null,
        weatherData: null,
        status: 'idle' // idle, loading, success, error
    },
    
    // Location 2 (Selected Map/Search Location - Variable)
    selectedLocation: {
        latitude: null,
        longitude: null,
        name: null,
        weatherData: null,
        status: 'idle'
    }
};

// Simple event bus for reactivity
const events = {};
function on(eventName, callback) {
    if (!events[eventName]) events[eventName] = [];
    events[eventName].push(callback);
}
function emit(eventName, data) {
    if (events[eventName]) {
        events[eventName].forEach(cb => cb(data));
    }
}
