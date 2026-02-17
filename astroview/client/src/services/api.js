/**
 * API Service — centralized fetch helper for all backend calls
 */
const API_BASE = '/api';

async function fetchAPI(endpoint) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        return json.data || json;
    } catch (err) {
        console.error(`[API] ${endpoint}:`, err.message);
        return null;
    }
}

// === Launches & Missions ===
export const getUpcomingLaunches = (limit = 10) => fetchAPI(`/launches/upcoming?limit=${limit}`);
export const getPreviousLaunches = (limit = 10) => fetchAPI(`/launches/previous?limit=${limit}`);
export const getSpaceXLaunches = () => fetchAPI('/launches/spacex');
export const getISROData = () => fetchAPI('/launches/isro');
export const getISRODetails = () => fetchAPI('/launches/isro-details');
export const getAgencyMissions = (agency) => fetchAPI(`/launches/agency-missions?agency=${agency}`);

// === Sky Events ===
export const getISSPosition = () => fetchAPI('/sky-events/iss');
export const getISSDetail = () => fetchAPI('/sky-events/iss-detail');
export const getAuroraForecast = () => fetchAPI('/sky-events/aurora');
export const getWeather = (lat, lon) => fetchAPI(`/sky-events/weather?lat=${lat}&lon=${lon}`);
export const getAPOD = () => fetchAPI('/sky-events/apod');

// === Space Weather ===
export const getSolarFlares = () => fetchAPI('/space-weather/solar-flares');
export const getGeomagneticStorms = () => fetchAPI('/space-weather/geomagnetic-storms');
export const getKpIndex = () => fetchAPI('/space-weather/kp-index');
export const getSolarWind = () => fetchAPI('/space-weather/solar-wind');
export const getSpaceWeatherAlerts = () => fetchAPI('/space-weather/alerts');
export const getCME = () => fetchAPI('/space-weather/cme');
export const getSpaceWeatherSummary = () => fetchAPI('/space-weather/summary');

// === Earth Insights ===
export const getEONETEvents = (limit = 20) => fetchAPI(`/earth-insights/events?limit=${limit}`);
export const getEPICImages = () => fetchAPI('/earth-insights/epic');
export const getClimateData = (lat, lon) => fetchAPI(`/earth-insights/climate?lat=${lat}&lon=${lon}`);
export const getEONETCategories = () => fetchAPI('/earth-insights/categories');

// === Learn ===
export const searchNASAImages = (query) => fetchAPI(`/learn/search?q=${encodeURIComponent(query)}`);
export const getAPODArchive = () => fetchAPI('/learn/apod-archive');
