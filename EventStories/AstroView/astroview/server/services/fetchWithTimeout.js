/**
 * Enhanced fetch with timeout and retry support.
 * Prevents API calls from hanging indefinitely.
 */
const fetch = require('node-fetch');
const AbortController = globalThis.AbortController || require('abort-controller');

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeout);
        return response;
    } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
            throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
        }
        throw err;
    }
}

async function fetchWithRetry(url, options = {}, { timeoutMs = 10000, retries = 2, delay = 1000 } = {}) {
    let lastError;
    for (let i = 0; i <= retries; i++) {
        try {
            return await fetchWithTimeout(url, options, timeoutMs);
        } catch (err) {
            lastError = err;
            console.warn(`[FETCH] Attempt ${i + 1}/${retries + 1} failed for ${url.split('?')[0]}: ${err.message}`);
            if (i < retries) {
                await new Promise(r => setTimeout(r, delay * (i + 1)));
            }
        }
    }
    throw lastError;
}

/**
 * Safe fetch — returns null instead of throwing on failure.
 * Use when a failed API call shouldn't crash the entire endpoint.
 */
async function safeFetch(url, options = {}, timeoutMs = 10000) {
    try {
        const res = await fetchWithTimeout(url, options, timeoutMs);
        return await res.json();
    } catch (err) {
        console.error(`[SAFE_FETCH] Failed: ${url.split('?')[0]} — ${err.message}`);
        return null;
    }
}

module.exports = { fetchWithTimeout, fetchWithRetry, safeFetch };
