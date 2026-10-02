class Cache {
    constructor(ttlMs) {
        this.cache = new Map();
        this.ttlMs = ttlMs;
    }

    set(key, value) {
        this.cache.set(key, {
            data: value,
            timestamp: Date.now()
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.ttlMs) {
            this.cache.delete(key);
            return null; // Stale
        }

        return item.data;
    }
}

module.exports = Cache;
