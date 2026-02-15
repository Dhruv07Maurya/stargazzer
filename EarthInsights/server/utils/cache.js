const cache = new Map();

// Cache expiration time in milliseconds (30 minutes)
const CACHE_TTL = 30 * 60 * 1000;

const get = (key) => {
    const item = cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
        cache.delete(key);
        return null; // Expired
    }

    return item.value;
};

const set = (key, value) => {
    cache.set(key, {
        value,
        expiry: Date.now() + CACHE_TTL
    });
};

module.exports = { get, set };
