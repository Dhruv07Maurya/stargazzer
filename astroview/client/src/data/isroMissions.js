/**
 * ISRO Missions — Static enrichment data
 * Adds descriptions, images, categories, and dates to ISRO's basic API data
 */
export const isroMissionDetails = {
    'Chandrayaan-1': { year: 2008, category: 'Lunar', icon: '🌙', status: 'Completed', desc: 'India\'s first lunar probe. Discovered water molecules on the Moon\'s surface using the Moon Impact Probe.' },
    'Chandrayaan-2': { year: 2019, category: 'Lunar', icon: '🌙', status: 'Partial Success', desc: 'Orbiter, lander (Vikram), and rover (Pragyan). Orbiter still operational, lander had hard landing.' },
    'Chandrayaan-3': { year: 2023, category: 'Lunar', icon: '🌙', status: 'Success', desc: 'Made India the 4th country to soft-land on the Moon and first to land near the lunar south pole.' },
    'Mangalyaan': { year: 2013, category: 'Mars', icon: '🔴', status: 'Success', desc: 'Mars Orbiter Mission — India became the first Asian nation to reach Mars orbit. Built for just $74M.' },
    'Aditya-L1': { year: 2023, category: 'Solar', icon: '☀️', status: 'Active', desc: 'India\'s first solar observatory, positioned at Lagrange point L1 to study the Sun\'s corona.' },
    'AstroSat': { year: 2015, category: 'Space Observatory', icon: '🔭', status: 'Active', desc: 'India\'s first dedicated multi-wavelength space observatory for studying celestial sources.' },
    'IRNSS': { year: 2013, category: 'Navigation', icon: '📡', status: 'Active', desc: 'NavIC — India\'s regional satellite navigation system providing positioning services over India.' },
    'GSAT-30': { year: 2020, category: 'Communication', icon: '📡', status: 'Active', desc: 'High-throughput communication satellite providing Indian mainland and island coverage.' },
    'RISAT-2BR1': { year: 2019, category: 'Earth Observation', icon: '🛰️', status: 'Active', desc: 'Radar imaging satellite for all-weather, day-and-night Earth observation and surveillance.' },
    'Cartosat-3': { year: 2019, category: 'Earth Observation', icon: '🛰️', status: 'Active', desc: 'Advanced Earth observation satellite with highest resolution imaging capability from ISRO.' },
    'EMISAT': { year: 2019, category: 'Defense', icon: '🛡️', status: 'Active', desc: 'Electronic intelligence satellite for monitoring electromagnetic spectrum from space.' },
    'GSAT-11': { year: 2018, category: 'Communication', icon: '📡', status: 'Active', desc: 'India\'s heaviest and most advanced communication satellite, providing broadband connectivity.' },
    'Aryabhata': { year: 1975, category: 'Scientific', icon: '⭐', status: 'Historic', desc: 'India\'s first satellite, named after the ancient mathematician. Launched by the Soviet Union.' },
    'Bhaskara-I': { year: 1979, category: 'Earth Observation', icon: '🌍', status: 'Historic', desc: 'Experimental satellite for Earth observation and ocean/land surface studies.' },
    'Rohini': { year: 1980, category: 'Scientific', icon: '🚀', status: 'Historic', desc: 'First satellite launched by India\'s own SLV-3 rocket, making India a spacefaring nation.' },
    'INSAT-1B': { year: 1983, category: 'Communication', icon: '📡', status: 'Historic', desc: 'Part of the INSAT series that revolutionized India\'s telecommunications and weather forecasting.' },
    'IRS-1A': { year: 1988, category: 'Earth Observation', icon: '🌍', status: 'Historic', desc: 'First satellite in the Indian Remote Sensing series, used for agricultural and resource monitoring.' },
    'PSLV': { year: 1993, category: 'Launch Vehicle', icon: '🚀', status: 'Active', desc: 'Polar Satellite Launch Vehicle — ISRO\'s workhorse rocket with 50+ successful missions.' },
    'GSLV': { year: 2001, category: 'Launch Vehicle', icon: '🚀', status: 'Active', desc: 'Geosynchronous Satellite Launch Vehicle — India\'s heavy-lift rocket with indigenous cryogenic engine.' },
    'LVM3': { year: 2014, category: 'Launch Vehicle', icon: '🚀', status: 'Active', desc: 'Launch Vehicle Mark-3 (formerly GSLV Mk III) — India\'s heaviest rocket, used for Chandrayaan-3.' },
    'Gaganyaan': { year: 2025, category: 'Human Spaceflight', icon: '👨‍🚀', status: 'Upcoming', desc: 'India\'s first crewed spaceflight mission, planned to send 3 astronauts to low Earth orbit.' },
};

export const isroLauncherDetails = {
    'PSLV': { icon: '🚀', launches: '55+', payload: '1,750 kg to SSO', desc: 'India\'s most reliable rocket. Launched Chandrayaan-1, Mangalyaan, and 104 satellites in a single mission.' },
    'GSLV': { icon: '🚀', launches: '15+', payload: '2,500 kg to GTO', desc: 'Medium-lift vehicle with indigenous cryogenic upper stage for geostationary orbit missions.' },
    'GSLV Mk III': { icon: '🚀', launches: '7+', payload: '4,000 kg to GTO', desc: 'India\'s heaviest rocket. Used for Chandrayaan-2, Chandrayaan-3 and will launch Gaganyaan.' },
    'LVM3': { icon: '🚀', launches: '7+', payload: '8,000 kg to LEO', desc: 'Renamed from GSLV Mk III. India\'s most powerful operational launcher.' },
    'SLV': { icon: '🚀', launches: '4', payload: '40 kg to LEO', desc: 'India\'s first indigenous Satellite Launch Vehicle. Made India the 6th spacefaring nation in 1980.' },
    'ASLV': { icon: '🚀', launches: '4', payload: '150 kg to LEO', desc: 'Augmented SLV — bridged the gap between SLV and PSLV development.' },
    'SSLV': { icon: '🚀', launches: '2', payload: '500 kg to LEO', desc: 'Small Satellite Launch Vehicle — for on-demand launches of small satellites.' },
    'RLV-TD': { icon: '🛩️', launches: 'Test', payload: 'Experimental', desc: 'Reusable Launch Vehicle Technology Demonstrator — India\'s space shuttle program prototype.' },
};

export const getCategoryColor = (category) => {
    const colors = {
        'Lunar': '#C0C0C0', 'Mars': '#ff6b35', 'Solar': '#f7b731',
        'Navigation': '#4cc9f0', 'Communication': '#7b61ff', 'Earth Observation': '#06d6a0',
        'Defense': '#ef476f', 'Scientific': '#4cc9f0', 'Space Observatory': '#7b61ff',
        'Launch Vehicle': '#ff6b35', 'Human Spaceflight': '#06d6a0', 'Historic': '#94a3b8',
    };
    return colors[category] || '#4cc9f0';
};
