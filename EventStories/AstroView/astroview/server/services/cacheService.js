/**
 * Cache Service — wraps node-cache for API response caching
 */
const NodeCache = require('node-cache');
const config = require('../config/apiConfig');

const cache = new NodeCache({ stdTTL: config.CACHE_TTL_MEDIUM, checkperiod: 120 });

module.exports = {
    get: (key) => cache.get(key),
    set: (key, value, ttl) => cache.set(key, value, ttl),
    has: (key) => cache.has(key),
    del: (key) => cache.del(key),
    flush: () => cache.flushAll(),
    stats: () => cache.getStats(),
};
