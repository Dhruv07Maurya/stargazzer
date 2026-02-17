/**
 * Launches & Missions Route
 * Sources: Launch Library 2, SpaceX API, ISRO API
 * All URLs from .env via apiConfig
 */
const express = require('express');
const router = express.Router();
const { fetchWithRetry: fetch } = require('../services/fetchWithTimeout');
const config = require('../config/apiConfig');
const cache = require('../services/cacheService');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/launches/upcoming — next launches from all agencies
router.get('/upcoming', asyncHandler(async (req, res) => {
    const cacheKey = 'launches_upcoming';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const limit = req.query.limit || 10;
    const response = await fetch(`${config.LAUNCH_LIBRARY_URL}/launch/upcoming/?limit=${limit}&mode=detailed`);
    const data = await response.json();

    const now = new Date();
    const launches = (data.results || [])
        .filter(l => {
            // Exclude already-completed launches (status 3=Success, 4=Failure)
            const statusId = l.status?.id;
            if (statusId === 3 || statusId === 4) return false;
            // Also exclude if net date is in the past
            if (l.net && new Date(l.net) < now) return false;
            return true;
        })
        .map(l => ({
            id: l.id,
            name: l.name,
            status: l.status?.name || 'Unknown',
            net: l.net,
            windowStart: l.window_start,
            windowEnd: l.window_end,
            provider: l.launch_service_provider?.name || 'Unknown',
            providerType: l.launch_service_provider?.type || '',
            rocket: l.rocket?.configuration?.full_name || l.name,
            mission: l.mission ? {
                name: l.mission.name,
                description: l.mission.description,
                type: l.mission.type,
                orbit: l.mission.orbit?.name || 'N/A',
            } : null,
            pad: l.pad ? {
                name: l.pad.name,
                location: l.pad.location?.name || '',
                country: l.pad.location?.country_code || '',
            } : null,
            image: l.image,
            webcastLive: l.webcast_live,
            url: l.url || null,
            slug: l.slug || null,
        }));

    cache.set(cacheKey, launches, config.CACHE_TTL_MEDIUM);
    res.json({ success: true, data: launches });
}));

// GET /api/launches/previous — past launches
router.get('/previous', asyncHandler(async (req, res) => {
    const cacheKey = 'launches_previous';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const limit = req.query.limit || 10;
    const response = await fetch(`${config.LAUNCH_LIBRARY_URL}/launch/previous/?limit=${limit}&mode=detailed`);
    const data = await response.json();

    const launches = (data.results || []).map(l => ({
        id: l.id,
        name: l.name,
        status: l.status?.name || 'Unknown',
        net: l.net,
        provider: l.launch_service_provider?.name || 'Unknown',
        rocket: l.rocket?.configuration?.full_name || l.name,
        mission: l.mission ? {
            name: l.mission.name,
            description: l.mission.description,
            type: l.mission.type,
        } : null,
        image: l.image,
        success: l.status?.id === 3,
        url: l.url || null,
        slug: l.slug || null,
    }));

    cache.set(cacheKey, launches, config.CACHE_TTL_LONG);
    res.json({ success: true, data: launches });
}));

// GET /api/launches/spacex — SpaceX specific launches
router.get('/spacex', asyncHandler(async (req, res) => {
    const cacheKey = 'launches_spacex';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const [upcomingRes, latestRes] = await Promise.all([
        fetch(`${config.SPACEX_API_URL}/launches/upcoming`),
        fetch(`${config.SPACEX_API_URL}/launches/latest`),
    ]);
    const upcoming = await upcomingRes.json();
    const latest = await latestRes.json();

    const result = { upcoming, latest };
    cache.set(cacheKey, result, config.CACHE_TTL_MEDIUM);
    res.json({ success: true, data: result });
}));

// GET /api/launches/isro — ISRO spacecrafts and launchers
router.get('/isro', asyncHandler(async (req, res) => {
    const cacheKey = 'launches_isro';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const [spacecraftsRes, launchersRes] = await Promise.all([
        fetch(`${config.ISRO_API_URL}/spacecrafts`),
        fetch(`${config.ISRO_API_URL}/launchers`),
    ]);
    const spacecrafts = await spacecraftsRes.json();
    const launchers = await launchersRes.json();

    const result = { spacecrafts: spacecrafts.spacecrafts || [], launchers: launchers.launchers || [] };
    cache.set(cacheKey, result, config.CACHE_TTL_LONG);
    res.json({ success: true, data: result });
}));

// ==========================================
// AGENCY MISSIONS — Wikipedia-powered data
// ==========================================

// Wikipedia title mappings (display name → Wikipedia article slug)
const WIKI_TITLES = {
    // ISRO Missions
    'Chandrayaan-1': 'Chandrayaan-1', 'Chandrayaan-2': 'Chandrayaan-2', 'Chandrayaan-3': 'Chandrayaan-3',
    'Mangalyaan (MOM)': 'Mars_Orbiter_Mission', 'Aditya-L1': 'Aditya-L1', 'AstroSat': 'AstroSat',
    'Gaganyaan': 'Gaganyaan', 'Aryabhata': 'Aryabhata_(satellite)', 'Rohini': 'Rohini_(satellite)',
    'IRNSS / NavIC': 'Indian_Regional_Navigation_Satellite_System', 'EMISAT': 'EMISAT',
    'Cartosat-3': 'Cartosat-3', 'RISAT-2BR1': 'RISAT-2BR1', 'GSAT-11': 'GSAT-11',
    'GSAT-30': 'GSAT-30', 'Oceansat-3': 'Oceansat-3', 'EOS-06': 'Oceansat-3',
    'INSAT-3DS': 'INSAT-3DS', 'XPoSat': 'XPoSat', 'NVS-01': 'NVS-01',
    'SPADEX': 'SPADEX_(spacecraft)', 'Bhaskara-I': 'Bhaskara_(satellite)',
    'IRS-1A': 'IRS-1A', 'INSAT-1B': 'INSAT-1B', 'Resourcesat-2A': 'Resourcesat-2A',
    // ISRO Launchers
    'PSLV': 'Polar_Satellite_Launch_Vehicle', 'GSLV': 'Geosynchronous_Satellite_Launch_Vehicle',
    'LVM3': 'LVM3', 'SSLV': 'Small_Satellite_Launch_Vehicle',
    'SLV': 'Satellite_Launch_Vehicle', 'ASLV': 'Augmented_Satellite_Launch_Vehicle',
    'RLV-TD': 'RLV_Technology_Demonstrator',
    // NASA Missions
    'James Webb Space Telescope': 'James_Webb_Space_Telescope', 'Hubble Space Telescope': 'Hubble_Space_Telescope',
    'Perseverance Rover': 'Perseverance_(rover)', 'Curiosity Rover': 'Curiosity_(rover)',
    'Artemis I': 'Artemis_1', 'Artemis II': 'Artemis_2', 'Artemis III': 'Artemis_3',
    'Voyager 1': 'Voyager_1', 'Voyager 2': 'Voyager_2', 'New Horizons': 'New_Horizons',
    'Juno': 'Juno_(spacecraft)', 'Parker Solar Probe': 'Parker_Solar_Probe',
    'OSIRIS-REx': 'OSIRIS-REx', 'InSight': 'InSight', 'DART': 'Double_Asteroid_Redirection_Test',
    'Lucy (spacecraft)': 'Lucy_(spacecraft)', 'Europa Clipper': 'Europa_Clipper',
    'Ingenuity Helicopter': 'Ingenuity_(helicopter)', 'Cassini-Huygens': 'Cassini%E2%80%93Huygens',
    'Kepler Space Telescope': 'Kepler_space_telescope', 'TESS': 'Transiting_Exoplanet_Survey_Satellite',
    'Chandra X-ray Observatory': 'Chandra_X-ray_Observatory',
    'Apollo 11': 'Apollo_11', 'Apollo 13': 'Apollo_13',
    // NASA Launchers
    'Space Launch System': 'Space_Launch_System', 'Space Shuttle': 'Space_Shuttle',
    'Saturn V': 'Saturn_V',
    // SpaceX Missions
    'Starship': 'SpaceX_Starship', 'Crew Dragon': 'SpaceX_Dragon_2',
    'Cargo Dragon': 'SpaceX_Dragon', 'Starlink': 'Starlink',
    'Crew-1': 'SpaceX_Crew-1', 'Crew-2': 'SpaceX_Crew-2', 'Crew-3': 'SpaceX_Crew-3',
    'Inspiration4': 'Inspiration4', 'Polaris Dawn': 'Polaris_Dawn',
    'Axiom-1': 'Axiom_Space#Axiom_Mission_1', 'dearMoon': 'DearMoon_project',
    'Transporter-1': 'SpaceX_Transporter-1',
    // SpaceX Launchers
    'Falcon 9': 'Falcon_9', 'Falcon Heavy': 'Falcon_Heavy', 'Falcon 1': 'Falcon_1',
};

// Agency mission lists
const AGENCY_MISSIONS = {
    isro: {
        missions: [
            'Chandrayaan-3', 'Chandrayaan-2', 'Chandrayaan-1', 'Mangalyaan (MOM)',
            'Aditya-L1', 'Gaganyaan', 'AstroSat', 'XPoSat', 'SPADEX',
            'IRNSS / NavIC', 'EMISAT', 'Cartosat-3', 'RISAT-2BR1',
            'GSAT-11', 'GSAT-30', 'INSAT-3DS', 'NVS-01', 'Oceansat-3',
            'Resourcesat-2A', 'Aryabhata', 'Rohini', 'Bhaskara-I', 'IRS-1A', 'INSAT-1B',
        ],
        launchers: ['PSLV', 'GSLV', 'LVM3', 'SSLV', 'SLV', 'ASLV', 'RLV-TD'],
    },
    nasa: {
        missions: [
            'James Webb Space Telescope', 'Hubble Space Telescope', 'Perseverance Rover', 'Curiosity Rover',
            'Artemis I', 'Artemis II', 'Artemis III', 'Voyager 1', 'Voyager 2', 'New Horizons',
            'Juno', 'Parker Solar Probe', 'OSIRIS-REx', 'InSight', 'DART',
            'Lucy (spacecraft)', 'Europa Clipper', 'Ingenuity Helicopter',
            'Cassini-Huygens', 'Kepler Space Telescope', 'TESS',
            'Chandra X-ray Observatory', 'Apollo 11', 'Apollo 13',
        ],
        launchers: ['Space Launch System', 'Space Shuttle', 'Saturn V'],
    },
    spacex: {
        missions: [
            'Starship', 'Crew Dragon', 'Cargo Dragon', 'Starlink',
            'Crew-1', 'Crew-2', 'Crew-3', 'Inspiration4', 'Polaris Dawn',
            'dearMoon', 'Transporter-1',
        ],
        launchers: ['Falcon 9', 'Falcon Heavy', 'Falcon 1'],
    },
};

// Helper: fetch Wikipedia summary for a given title
async function fetchWikiSummary(name) {
    const wikiTitle = WIKI_TITLES[name] || name.replace(/ /g, '_');
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
        name,
        title: data.title || name,
        description: data.description || '',
        summary: data.extract || '',
        image: data.thumbnail?.source || data.originalimage?.source || null,
        sourceUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${wikiTitle}`,
        wikiUrl: data.content_urls?.desktop?.page || null,
    };
}

// GET /api/launches/agency-missions?agency=isro|nasa|spacex
router.get('/agency-missions', asyncHandler(async (req, res) => {
    const agency = (req.query.agency || 'isro').toLowerCase();
    const agencyData = AGENCY_MISSIONS[agency];
    if (!agencyData) {
        return res.status(400).json({ success: false, error: `Unknown agency: ${agency}. Use isro, nasa, or spacex.` });
    }

    const cacheKey = `agency_missions_${agency}`;
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    // Fetch all Wikipedia summaries in parallel
    const allNames = [...agencyData.missions, ...agencyData.launchers];
    const results = await Promise.allSettled(allNames.map(name => fetchWikiSummary(name)));

    const missions = [];
    const launchers = [];

    results.forEach((result, i) => {
        if (result.status === 'fulfilled' && result.value) {
            if (i < agencyData.missions.length) {
                missions.push(result.value);
            } else {
                launchers.push(result.value);
            }
        }
    });

    const data = { agency, missions, launchers };
    cache.set(cacheKey, data, 86400); // Cache 24 hours
    res.json({ success: true, data });
}));

// Keep backward compat
router.get('/isro-details', asyncHandler(async (req, res) => {
    // Redirect to agency-missions?agency=isro
    req.query.agency = 'isro';
    const cacheKey = 'agency_missions_isro';
    if (cache.has(cacheKey)) return res.json({ success: true, data: cache.get(cacheKey), cached: true });

    const agencyData = AGENCY_MISSIONS.isro;
    const allNames = [...agencyData.missions, ...agencyData.launchers];
    const results = await Promise.allSettled(allNames.map(name => fetchWikiSummary(name)));
    const missions = [];
    const launchers = [];
    results.forEach((result, i) => {
        if (result.status === 'fulfilled' && result.value) {
            if (i < agencyData.missions.length) missions.push(result.value);
            else launchers.push(result.value);
        }
    });
    const data = { agency: 'isro', missions, launchers };
    cache.set(cacheKey, data, 86400);
    res.json({ success: true, data });
}));

module.exports = router;
