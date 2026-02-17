import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { IoLocate, IoStar, IoTime, IoSunny, IoMoon, IoOpenOutline, IoPlanet, IoSearch, IoFilter, IoEyeOutline } from 'react-icons/io5';
import { getISSPosition } from '../services/api';
import * as Astronomy from 'astronomy-engine';
import ErrorBoundary from '../components/ErrorBoundary';

/* ─── Constants ─── */
const BODIES = [
    { id: 'Sun', label: 'Sun', emoji: '☀️', color: '#FFD93D', glow: '#FFD93D50', size: 28, type: 'star', wiki: 'https://en.wikipedia.org/wiki/Sun', dist: '149.6M km', desc: 'Our nearest star — 150 million km away. Never look directly at the Sun!' },
    { id: 'Moon', label: 'Moon', emoji: '🌙', color: '#C8D6E5', glow: '#C8D6E540', size: 24, type: 'satellite', wiki: 'https://en.wikipedia.org/wiki/Moon', dist: '384,400 km', desc: 'Earth\'s only natural satellite. Orbits at ~384,400 km distance.' },
    { id: 'Mercury', label: 'Mercury', emoji: '☿', color: '#B0B0B0', glow: '#B0B0B040', size: 10, type: 'planet', wiki: 'https://en.wikipedia.org/wiki/Mercury_(planet)', mag: '-1.9 to +5.5', desc: 'Smallest planet, closest to the Sun. Very hard to spot — look near horizon at dawn/dusk.' },
    { id: 'Venus', label: 'Venus', emoji: '♀', color: '#F5E6CA', glow: '#F5E6CA50', size: 16, type: 'planet', wiki: 'https://en.wikipedia.org/wiki/Venus', mag: '-4.9 to -3.8', desc: 'The "Morning/Evening Star." Brightest planet — impossible to miss when visible!' },
    { id: 'Mars', label: 'Mars', emoji: '♂', color: '#E06050', glow: '#E0605050', size: 12, type: 'planet', wiki: 'https://en.wikipedia.org/wiki/Mars', mag: '-2.9 to +1.8', desc: 'The Red Planet. Look for its distinctive orange-red color among the stars.' },
    { id: 'Jupiter', label: 'Jupiter', emoji: '♃', color: '#D4A574', glow: '#D4A57450', size: 20, type: 'planet', wiki: 'https://en.wikipedia.org/wiki/Jupiter', mag: '-2.9 to -1.6', desc: 'Largest planet. Very bright — binoculars can show its 4 Galilean moons!' },
    { id: 'Saturn', label: 'Saturn', emoji: '♄', color: '#E8D5A0', glow: '#E8D5A040', size: 18, type: 'planet', wiki: 'https://en.wikipedia.org/wiki/Saturn', mag: '-0.5 to +1.1', desc: 'The Ringed Planet. A small telescope reveals its spectacular ring system.' },
    { id: 'Uranus', label: 'Uranus', emoji: '⛢', color: '#7EC8C8', glow: '#7EC8C840', size: 10, type: 'planet', wiki: 'https://en.wikipedia.org/wiki/Uranus', mag: '+5.3 to +5.9', desc: 'Ice giant. Barely visible to the naked eye as a faint blue-green dot.' },
    { id: 'Neptune', label: 'Neptune', emoji: '♆', color: '#5B8DEF', glow: '#5B8DEF40', size: 10, type: 'planet', wiki: 'https://en.wikipedia.org/wiki/Neptune', mag: '+7.7 to +8.0', desc: 'Farthest planet. Only visible through a telescope. Deep blue color.' },
];

/* Approx RA/Dec for constellation centers (J2000) */
const CONSTELLATIONS = [
    { id: 'Orion', name: 'Orion', season: 'Winter', stars: 7, emoji: '🏹', wiki: 'https://en.wikipedia.org/wiki/Orion_(constellation)', desc: 'The Hunter — look for the three stars of Orion\'s Belt.', ra: 5.5, dec: 5 },
    { id: 'UrsaMajor', name: 'Ursa Major', season: 'All year (N)', stars: 7, emoji: '🐻', wiki: 'https://en.wikipedia.org/wiki/Ursa_Major', desc: 'Contains the Big Dipper. Pointer stars aim at Polaris.', ra: 11, dec: 50 },
    { id: 'Scorpius', name: 'Scorpius', season: 'Summer', stars: 18, emoji: '🦂', wiki: 'https://en.wikipedia.org/wiki/Scorpius', desc: 'Bright red Antares at its heart. Best seen low in South.', ra: 16.5, dec: -26 },
    { id: 'Cassiopeia', name: 'Cassiopeia', season: 'All year (N)', stars: 5, emoji: '💫', wiki: 'https://en.wikipedia.org/wiki/Cassiopeia_(constellation)', desc: 'Distinctive W-shape. Circumpolar from northern latitudes.', ra: 1, dec: 60 },
    { id: 'Leo', name: 'Leo', season: 'Spring', stars: 9, emoji: '🦁', wiki: 'https://en.wikipedia.org/wiki/Leo_(constellation)', desc: 'The Lion. Look for the reversed question mark "sickle".', ra: 10.5, dec: 15 },
    { id: 'Cygnus', name: 'Cygnus', season: 'Summer', stars: 9, emoji: '🦢', wiki: 'https://en.wikipedia.org/wiki/Cygnus_(constellation)', desc: 'The Swan / Northern Cross. Contains bright Deneb.', ra: 20.5, dec: 42 },
    { id: 'Gemini', name: 'Gemini', season: 'Winter', stars: 8, emoji: '👯', wiki: 'https://en.wikipedia.org/wiki/Gemini_(constellation)', desc: 'The Twins — bright stars Castor and Pollux.', ra: 7, dec: 20 },
    { id: 'Lyra', name: 'Lyra', season: 'Summer', stars: 5, emoji: '🎵', wiki: 'https://en.wikipedia.org/wiki/Lyra', desc: 'Contains Vega — one of the brightest stars in our sky.', ra: 18.6, dec: 39 },
    { id: 'Taurus', name: 'Taurus', season: 'Winter', stars: 14, emoji: '🐂', wiki: 'https://en.wikipedia.org/wiki/Taurus_(constellation)', desc: 'The Bull. Look for the red star Aldebaran and Pleiades cluster.', ra: 4.5, dec: 16 },
    { id: 'Pegasus', name: 'Pegasus', season: 'Autumn', stars: 10, emoji: '🐴', wiki: 'https://en.wikipedia.org/wiki/Pegasus_(constellation)', desc: 'The Winged Horse. Look for the Great Square of Pegasus.', ra: 23, dec: 20 },
    { id: 'Andromeda', name: 'Andromeda', season: 'Autumn', stars: 16, emoji: '⛓️', wiki: 'https://en.wikipedia.org/wiki/Andromeda_(constellation)', desc: 'The Chained Maiden. Home to the Andromeda Galaxy (M31).', ra: 1, dec: 40 },
    { id: 'Aquila', name: 'Aquila', season: 'Summer', stars: 10, emoji: '🦅', wiki: 'https://en.wikipedia.org/wiki/Aquila_(constellation)', desc: 'The Eagle. Contains bright star Altair.', ra: 19.8, dec: 3 },
];

/* Approx RA/Dec for Deep Sky Objects */
const DEEP_SKY = [
    { id: 'Pleiades', name: 'Pleiades', type: 'dso', label: 'M45', emoji: '✨', wiki: 'https://en.wikipedia.org/wiki/Pleiades', desc: 'The Seven Sisters. A stunning open star cluster in Taurus.', ra: 3.8, dec: 24, color: '#4cc9f0', size: 14 },
    { id: 'AndromedaG', name: 'Andromeda G', type: 'dso', label: 'M31', emoji: '🌀', wiki: 'https://en.wikipedia.org/wiki/Andromeda_Galaxy', desc: 'Andromeda Galaxy. The nearest major galaxy to the Milky Way.', ra: 0.7, dec: 41, color: '#a0a0a0', size: 16 },
    { id: 'OrionNeb', name: 'Orion Neb', type: 'dso', label: 'M42', emoji: '🌫️', wiki: 'https://en.wikipedia.org/wiki/Orion_Nebula', desc: 'Orion Nebula. A stellar nursery visible to the naked eye.', ra: 5.6, dec: -5.4, color: '#ff99cc', size: 14 },
    { id: 'Beehive', name: 'Beehive', type: 'dso', label: 'M44', emoji: '🐝', wiki: 'https://en.wikipedia.org/wiki/Beehive_Cluster', desc: 'Beehive Cluster. Open cluster in Cancer.', ra: 8.7, dec: 19, color: '#ffd700', size: 12 },
];

/* ─── Helpers ─── */
function getMoonPhase(frac) {
    if (frac < 0.03 || frac > 0.97) return '🌑 New Moon';
    if (frac < 0.22) return '🌒 Waxing Crescent';
    if (frac < 0.28) return '🌓 First Quarter';
    if (frac < 0.47) return '🌔 Waxing Gibbous';
    if (frac < 0.53) return '🌕 Full Moon';
    if (frac < 0.72) return '🌖 Waning Gibbous';
    if (frac < 0.78) return '🌗 Last Quarter';
    return '🌘 Waning Crescent';
}

function directionName(az) {
    if (az < 22.5 || az > 337.5) return 'North';
    if (az < 67.5) return 'NE'; if (az < 112.5) return 'East';
    if (az < 157.5) return 'SE'; if (az < 202.5) return 'South';
    if (az < 247.5) return 'SW'; if (az < 292.5) return 'West';
    return 'NW';
}

function heightDesc(alt) {
    if (alt > 70) return 'near zenith (straight up)'; if (alt > 45) return 'high in the sky';
    if (alt > 20) return 'mid-sky'; if (alt > 10) return 'low in the sky';
    return 'very close to the horizon';
}

function formatRA(raHours) {
    const h = Math.floor(raHours);
    const m = Math.floor((raHours - h) * 60);
    return `${h}h ${m}m`;
}

function formatDec(decDeg) {
    const d = Math.floor(Math.abs(decDeg));
    const m = Math.floor((Math.abs(decDeg) - d) * 60);
    return `${decDeg >= 0 ? '+' : '-'}${d}° ${m}'`;
}

function altAzToXY(alt, az, R) {
    // Correct projection for a dome view looking UP

    // For visible objects (alt > 0): 0 to R
    // For below horizon (alt < 0): R to R*1.1 (faded ring outside)

    let r;
    if (alt >= 0) {
        // 90 deg = 0 (center), 0 deg = R (edge)
        r = ((90 - alt) / 90) * R;
    } else {
        // 0 deg = R, -90 deg = R*1.5 (far out)
        // We compress the underworld into a ring from R to 1.2R for visibility
        r = R + (Math.abs(alt) / 90) * (R * 0.4);
    }

    const a = (az * Math.PI) / 180;
    // Map bearing to screen coordinates (North up)
    return { x: R + r * Math.sin(a), y: R - r * Math.cos(a) };
}

function computeAll(date, lat, lng) {
    const obs = new Astronomy.Observer(lat, lng, 0);
    const out = {};

    // Planets & Sun/Moon
    for (const b of BODIES) {
        try {
            // Calculate RA/Dec first using Equator
            const equ = Astronomy.Equator(b.id, date, obs, true, true);
            const h = Astronomy.Horizon(date, obs, equ.ra, equ.dec, 'normal');

            let mag = null;
            if (b.id !== 'Sun' && b.id !== 'Moon') {
                try { mag = Astronomy.Illumination(b.id, date).mag; } catch (e) { }
            }

            out[b.id] = {
                alt: h.altitude,
                az: h.azimuth,
                visible: h.altitude > -0.83,
                type: 'body',
                ra: formatRA(equ.ra),
                dec: formatDec(equ.dec),
                mag: mag ? mag.toFixed(1) : null
            };
        } catch (e) {
            console.error(`Error computing position for ${b.id}:`, e);
            out[b.id] = { alt: -90, az: 0, visible: false, type: 'body' };
        }
    }

    // Constellations & DSO (Fixed Stars approx)
    const fixedObjects = [...CONSTELLATIONS, ...DEEP_SKY];
    for (const c of fixedObjects) {
        try {
            const ra = c.ra;
            const dec = c.dec;
            const siderial = Astronomy.SiderealTime(date);
            const lst = siderial + lng / 15;
            const ha = (lst - ra) * 15;
            const dRad = dec * Math.PI / 180;
            const lRad = lat * Math.PI / 180;
            const hRad = ha * Math.PI / 180;
            const altRad = Math.asin(Math.sin(dRad) * Math.sin(lRad) + Math.cos(dRad) * Math.cos(lRad) * Math.cos(hRad));
            const alt = altRad * 180 / Math.PI;
            const azCos = (Math.sin(dRad) - Math.sin(altRad) * Math.sin(lRad)) / (Math.cos(altRad) * Math.cos(lRad));
            let az = Math.acos(Math.max(-1, Math.min(1, azCos))) * 180 / Math.PI;
            if (Math.sin(hRad) > 0) az = 360 - az;

            out[c.id] = {
                alt,
                az,
                visible: alt > -5,
                type: c.type === 'dso' ? 'dso' : 'constellation',
                ra: formatRA(c.ra),
                dec: formatDec(c.dec)
            };
        } catch (e) { console.error(e); out[c.id] = { alt: -90, az: 0, visible: false, type: 'constellation' }; }
    }

    try { out._moonFrac = Astronomy.MoonPhase(date) / 360; } catch { out._moonFrac = 0; }
    return out;
}

function computeRiseSet(date, lat, lng) {
    const obs = new Astronomy.Observer(lat, lng, 0);
    const rs = {};
    for (const n of ['Sun', 'Moon', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
        try {
            // Use string body name 'Sun', 'Moon', etc. directly
            const rise = Astronomy.SearchRiseSet(n, obs, 1, date, 1);
            const set = Astronomy.SearchRiseSet(n, obs, -1, date, 1);
            rs[n] = { rise: rise?.date || null, set: set?.date || null };
        } catch (e) {
            console.error(`Error computing rise/set for ${n}:`, e);
            rs[n] = { rise: null, set: null };
        }
    }
    return rs;
}

/* ─── Reading View (Side Panel) ─── */
function ObjectReadingView({ item, pos, riseSet, onClose }) {
    if (!item || !pos) return null;
    const isBody = item.type === 'star' || item.type === 'planet' || item.type === 'satellite';
    const isDSO = item.type === 'dso';
    const rs = riseSet?.[item.id];

    return (
        <div className="glass-card animate-in stagger-2" style={{
            padding: 24,
            border: '1px solid var(--accent-cyan)40',
            background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.08) 0%, rgba(5, 10, 20, 0.4) 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Accent Glow */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: `${item.glow || 'var(--accent-cyan)'}20`, filter: 'blur(30px)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        fontSize: '2.5rem', width: 68, height: 68, borderRadius: '18px',
                        background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 25px ${item.glow || 'rgba(255,255,255,0.1)'}`,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {item.emoji}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>{item.label || item.name}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <div style={{ fontSize: '0.7rem', color: isBody ? item.color : (isDSO ? '#4cc9f0' : 'var(--text-muted)'), fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                                {isBody ? item.type : (isDSO ? 'Deep Sky Object' : 'Constellation')}
                            </div>
                            {item.label && <span className="tag" style={{ fontSize: '0.6rem', padding: '2px 6px', opacity: 0.8 }}>{item.label}</span>}
                        </div>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>✕</button>
            </div>

            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', marginBottom: 24, fontStyle: 'italic' }}>
                "{item.desc}"
            </p>

            {/* Main Observational Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.8, fontWeight: 600 }}>Altitude</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{pos.alt.toFixed(1)}°</div>
                </div>
                <div style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.8, fontWeight: 600 }}>Azimuth</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{pos.az.toFixed(1)}°</div>
                </div>
            </div>

            {/* Secondary Technical Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Right Ascension</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{pos.ra || '--'}</div>
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Declination</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{pos.dec || '--'}</div>
                </div>
                {(item.mag || pos.mag) && (
                    <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Magnitude / Brightness</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFD93D' }}>{pos.mag || item.mag}</div>
                    </div>
                )}
                {item.dist && (
                    <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Distance</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{item.dist}</div>
                    </div>
                )}
            </div>

            <div style={{
                padding: '14px 18px',
                background: pos.alt > 0 ? 'rgba(6,214,160,0.08)' : 'rgba(239,71,111,0.08)',
                borderRadius: 14,
                border: '1px solid',
                borderColor: pos.alt > 0 ? 'rgba(6,214,160,0.15)' : 'rgba(239,71,111,0.15)',
                marginBottom: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: pos.alt > 0 ? '#06D6A0' : '#EF476F', boxShadow: pos.alt > 0 ? '0 0 10px #06D6A0' : 'none' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: pos.alt > 0 ? '#06D6A0' : '#EF476F', letterSpacing: 0.5 }}>
                        {pos.alt > 0 ? 'STATUS: VISIBLE IN YOUR SKY' : 'STATUS: BELOW HORIZON'}
                    </span>
                </div>
                {pos.alt > 0 && (
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <IoLocate style={{ color: 'var(--accent-cyan)' }} />
                        <span>Face <strong>{directionName(pos.az)}</strong> and look <strong>{heightDesc(pos.alt)}</strong>.</span>
                    </div>
                )}
            </div>

            {rs && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: 20 }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 }}>Rise Time</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <IoSunny style={{ color: '#FFD93D', fontSize: '1rem' }} />
                            {rs.rise ? new Date(rs.rise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 }}>Set Time</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                            {rs.set ? new Date(rs.set).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            <IoMoon style={{ color: '#C8D6E5', fontSize: '0.9rem' }} />
                        </div>
                    </div>
                </div>
            )}

            {item.wiki && (
                <a href={item.wiki} target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#fff', textDecoration: 'none', borderRadius: 12, fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--accent-cyan)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                    <IoOpenOutline style={{ fontSize: '1.1rem' }} />
                    Read More on Wikipedia
                </a>
            )}
        </div>
    );
}

/* ─── Popup tooltip shown ON the dome (Minimal) ─── */
function DomeTooltip({ item, pos, domeSize }) {
    if (!item || !pos) return null;

    // Calculate position
    const R = domeSize / 2;
    const { x, y } = altAzToXY(pos.alt, pos.az, R);

    const tipW = 140;

    // Minimal floating pointer
    return (
        <div style={{
            position: 'absolute', top: y + 15, left: x - tipW / 2, width: tipW,
            pointerEvents: 'none', zIndex: 100, textAlign: 'center'
        }}>
            <div style={{
                background: 'rgba(0,0,0,0.85)', padding: '6px 10px', borderRadius: 8,
                border: '1px solid var(--accent-cyan)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)'
            }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#fff' }}>{item.label || item.name}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)' }}>Alt {pos.alt.toFixed(0)}° · Az {pos.az.toFixed(0)}°</div>
            </div>
            <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid var(--accent-cyan)', margin: '-32px auto 0 auto', transform: 'rotate(180deg)' }} />
        </div>
    );
}

/* ─── Main Component ─── */
function SkyMapContent() {
    const [loc, setLoc] = useState(null);
    const [iss, setISS] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [timeOffset, setTimeOffset] = useState(0);
    const [locStatus, setLocStatus] = useState('requesting');
    const [isAnimating, setIsAnimating] = useState(false);

    // Dome resizing
    const domeRef = useRef(null);
    const [domeRect, setDomeRect] = useState(null);

    // View Filters
    const [showPlanets, setShowPlanets] = useState(true);
    const [showConstellations, setShowConstellations] = useState(true);
    const [showDSO, setShowDSO] = useState(true);
    const [viewBelow, setViewBelow] = useState(false); // Refreshed state name to force reset

    const animRef = useRef(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                p => { setLoc({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocStatus('ok'); },
                () => { setLoc({ lat: 28.6139, lng: 77.209 }); setLocStatus('default'); }
            );
        } else { setLoc({ lat: 28.6139, lng: 77.209 }); setLocStatus('default'); }

        getISSPosition().then(setISS);
        const iv = setInterval(() => getISSPosition().then(setISS), 15000);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => {
        if (!domeRef.current) return;
        const ro = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) {
                setDomeRect(entry.contentRect);
            }
        });
        ro.observe(domeRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (!isAnimating) { if (animRef.current) cancelAnimationFrame(animRef.current); return; }
        let last = performance.now();
        const tick = (now) => {
            const dt = (now - last) / 1000;
            last = now;
            setTimeOffset(prev => {
                const next = prev + dt * 0.5;
                if (next > 12) return -12;
                return next;
            });
            animRef.current = requestAnimationFrame(tick);
        };
        animRef.current = requestAnimationFrame(tick);
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, [isAnimating]);

    const viewDate = useMemo(() => {
        const d = new Date(); d.setMinutes(d.getMinutes() + timeOffset * 60); return d;
    }, [timeOffset]);

    const positions = useMemo(() => {
        if (!loc) return {};
        try {
            const res = computeAll(viewDate, loc.lat, loc.lng);
            console.log('SkyMap positions computed:', Object.keys(res).length);
            return res;
        } catch (e) {
            console.error('SkyMap computeAll error:', e);
            return {};
        }
    }, [loc, viewDate]);
    const riseSet = useMemo(() => loc ? computeRiseSet(new Date(), loc.lat, loc.lng) : {}, [loc]);

    console.log('SkyMap Render. Loc:', loc, 'Positions:', Object.keys(positions).length);

    const allItems = useMemo(() => [...BODIES, ...CONSTELLATIONS, ...DEEP_SKY], []);

    // Only show planets/Sun/Moon on the dome; constellations & DSO are in the right-side list
    const domeItems = useMemo(() => {
        let items = [];
        if (showPlanets) items = [...items, ...BODIES];
        if (showConstellations) items = [...items, ...CONSTELLATIONS];
        if (showDSO) items = [...items, ...DEEP_SKY];
        return items;
    }, [showPlanets, showConstellations, showDSO]);

    const selectedItem = selectedId ? allItems.find(i => (i.id || i.name) === selectedId) : null;
    const selectedPos = selectedId ? positions[selectedId] : null;

    const onSelect = useCallback(id => setSelectedId(prev => prev === id ? null : id), []);

    const timeLabel = timeOffset === 0
        ? `Now · ${viewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : `${timeOffset > 0 ? '+' : ''}${timeOffset.toFixed(1)}h · ${viewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const domeSize = domeRect ? domeRect.width : 500;

    const visibleCount = domeItems.filter(i => positions[i.id || i.name]?.alt > 0).length;

    return (
        <div className="animate-in">
            <div className="page-header flex-between" style={{ alignItems: 'flex-start' }}>
                <div>
                    <h1>🗺️ Interactive Sky Map</h1>
                    <p>Real-time planet & star positions calculated for your location</p>
                </div>

                <div style={{ display: 'flex', gap: 8, background: 'var(--bg-card)', padding: 6, borderRadius: 12, border: '1px solid var(--bg-glass-border)' }}>
                    <button onClick={() => setShowPlanets(!showPlanets)}
                        className={`section-tab ${showPlanets ? 'active' : ''}`}
                        title="Toggle Planets"
                        style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                        <IoPlanet /> {showPlanets ? 'Planets' : 'Off'}
                    </button>
                    <button onClick={() => setShowConstellations(!showConstellations)}
                        className={`section-tab ${showConstellations ? 'active' : ''}`}
                        title="Toggle Constellations"
                        style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                        <IoStar /> {showConstellations ? 'Stars' : 'Off'}
                    </button>
                    <button onClick={() => setShowDSO(!showDSO)}
                        className={`section-tab ${showDSO ? 'active' : ''}`}
                        title="Deep Sky Objects"
                        style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                        <IoSearch /> {showDSO ? 'Deep Sky' : 'Off'}
                    </button>
                    <button onClick={() => setViewBelow(!viewBelow)}
                        className={`section-tab ${viewBelow ? 'active' : ''}`}
                        title="Show objects below horizon"
                        style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                        <IoEyeOutline /> {viewBelow ? 'Below' : 'Hidden'}
                    </button>
                </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 20, gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', alignItems: 'start' }}>
                <div className="glass-card animate-in stagger-1" style={{ padding: 0, overflow: 'hidden', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                    <div className="sky-dome-container" ref={domeRef} onClick={() => setSelectedId(null)}>
                        <div style={{ position: 'absolute', inset: 0 }}>
                            {/* Grid Lines */}
                            {[0, 30, 60].map(alt => {
                                const rPct = ((90 - alt) / 90) * 50;
                                return <div key={alt} style={{ position: 'absolute', top: `${50 - rPct}%`, left: `${50 - rPct}%`, width: `${rPct * 2}%`, height: `${rPct * 2}%`, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', pointerEvents: 'none' }}>
                                    <span style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.1)' }}>{alt}°</span>
                                </div>;
                            })}

                            {/* Horizon Line (Alt 0) - Distinct */}
                            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(6, 214, 160, 0.3)', boxShadow: '0 0 20px rgba(6, 214, 160, 0.1)' }} />

                            {/* Crosshairs */}
                            <div style={{ position: 'absolute', top: '50%', left: '2%', right: '2%', height: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', left: '50%', top: '2%', bottom: '2%', width: 1, background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

                            {/* Compass Labels */}
                            {[
                                { label: 'N', top: '2%', left: '50%', transform: '-50%, 0', color: 'var(--accent-cyan)' },
                                { label: 'S', top: '98%', left: '50%', transform: '-50%, -100%', color: 'rgba(255,255,255,0.3)' },
                                { label: 'E', top: '50%', left: '98%', transform: '-100%, -50%', color: 'rgba(255,255,255,0.3)' },
                                { label: 'W', top: '50%', left: '2%', transform: '0, -50%', color: 'rgba(255,255,255,0.3)' },
                            ].map((c, i) => (
                                <span key={i} style={{ position: 'absolute', top: c.top, left: c.left, transform: `translate(${c.transform})`, color: c.color, fontWeight: 700, fontSize: '0.9rem', pointerEvents: 'none' }}>{c.label}</span>
                            ))}

                            {/* Render Objects */}
                            {domeItems.map(item => {
                                const id = item.id || item.name;
                                const p = positions[id];
                                if (!p) return null;

                                const isBelow = p.alt < 0;
                                if (isBelow && !viewBelow) return null;

                                // Don't render way below horizon (-90) unless requested, but let's clamp for visual sanity
                                if (p.alt < -50) return null;

                                const rNorm = isBelow
                                    ? 1.0 + (Math.abs(p.alt) / 90) * 0.4  // Ring outside: 1.0 to 1.4
                                    : (90 - p.alt) / 90;              // Inside: 0.0 to 1.0

                                const azRad = p.az * Math.PI / 180;
                                let left = 50 + rNorm * Math.sin(azRad) * 45; // 45% radius scale
                                let top = 50 - rNorm * Math.cos(azRad) * 45;

                                // Final Safety: If anything is NaN or crazy, don't render it (prevents ghosts on left)
                                if (isNaN(left) || isNaN(top)) return null;

                                const isSel = selectedId === id;
                                const isConst = item.ra !== undefined && item.type !== 'dso';
                                const isDSOItem = item.type === 'dso';
                                const size = (isConst || isDSOItem) ? (item.size || 24) : (item.size);

                                return (
                                    <div key={id} onClick={e => { e.stopPropagation(); onSelect(id); }}
                                        className="sky-object"
                                        style={{
                                            position: 'absolute',
                                            top: `${top}%`, left: `${left}%`,
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: isSel ? 20 : (isBelow ? 5 : 10),
                                            opacity: isBelow ? 0.3 : (isSel ? 1 : 0.85),
                                            filter: isBelow ? 'grayscale(0.6)' : 'none',
                                            pointerEvents: 'auto',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}>
                                        {/* Glow dot behind the emoji */}
                                        {!isConst && !isDSOItem && (
                                            <div style={{
                                                position: 'absolute', top: '50%', left: '50%',
                                                transform: 'translate(-50%, -60%)',
                                                width: isSel ? size * 1.2 : size * 0.6,
                                                height: isSel ? size * 1.2 : size * 0.6,
                                                borderRadius: '50%',
                                                background: `radial-gradient(circle, ${item.color || '#fff'}40 0%, transparent 70%)`,
                                                pointerEvents: 'none',
                                                transition: 'all 0.3s ease'
                                            }} />
                                        )}
                                        <div className="sky-object-icon" style={{
                                            fontSize: (isConst || isDSOItem) ? '1rem' : `${Math.max(0.9, size / 14)}rem`,
                                            filter: isSel ? `drop-shadow(0 0 8px ${item.glow || '#fff'})` : 'none',
                                            transform: isSel ? 'scale(1.3)' : 'scale(1)',
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            position: 'relative'
                                        }}>
                                            {item.emoji}
                                        </div>
                                        <div style={{
                                            fontSize: '0.6rem',
                                            color: isSel ? '#fff' : (isBelow ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)'),
                                            marginTop: 1, fontWeight: 600,
                                            textShadow: '0 1px 3px rgba(0,0,0,0.95)',
                                            pointerEvents: 'none', whiteSpace: 'nowrap',
                                            textAlign: 'center', letterSpacing: '0.02em'
                                        }}>
                                            {item.label || item.name}
                                        </div>
                                        {/* Only show coordinates on selected item */}
                                        {isSel && (
                                            <div style={{
                                                fontSize: '0.5rem', fontWeight: 400,
                                                color: 'var(--accent-cyan)', opacity: 0.8,
                                                pointerEvents: 'none', whiteSpace: 'nowrap',
                                                textAlign: 'center'
                                            }}>
                                                Alt {p.alt.toFixed(0)}° · Az {p.az.toFixed(0)}°
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Selected Pointer Pointer on Dome */}
                            {selectedId && (
                                <DomeTooltip
                                    item={selectedItem}
                                    pos={selectedPos}
                                    domeSize={domeSize}
                                />
                            )}

                            {/* Location Tag */}
                            {loc && (
                                <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                                    {loc.lat.toFixed(1)}°, {loc.lng.toFixed(1)}°
                                </div>
                            )}
                            <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <IoLocate className="card-icon" />
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Your Sky</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls Bar */}
                    <div className="glass-card" style={{ marginTop: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                            <button onClick={() => setIsAnimating(!isAnimating)}
                                style={{
                                    width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                    background: isAnimating ? '#EF476F' : 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#000', fontSize: '1.1rem', transition: 'all 0.2s'
                                }}>
                                {isAnimating ? '⏸' : '▶'}
                            </button>
                            <div style={{ flex: 1 }}>
                                <input type="range" min={-12} max={12} step={0.25} value={timeOffset}
                                    onChange={e => { setTimeOffset(parseFloat(e.target.value)); setIsAnimating(false); }}
                                    style={{ width: '100%', height: 4, accentColor: 'var(--accent-cyan)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                    <span>-12h</span>
                                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{timeLabel}</span>
                                    <span>+12h</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => { setTimeOffset(0); setIsAnimating(false); }}
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', height: 32 }}>
                            Reset
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Reading View Contextual Card */}
                    {selectedId ? (
                        <ObjectReadingView
                            item={selectedItem}
                            pos={selectedPos}
                            riseSet={riseSet}
                            onClose={() => setSelectedId(null)}
                        />
                    ) : (
                        <div className="glass-card animate-in stagger-2" style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <IoPlanet style={{ fontSize: '2.5rem', color: 'var(--text-muted)', opacity: 0.3, marginBottom: 12 }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Select an object</div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                Click any item on the dome to view detailed astronomical data and location guides.
                            </p>
                        </div>
                    )}

                    <div className="glass-card animate-in stagger-3">
                        <div className="card-header">
                            <div className="card-title"><IoMoon className="card-icon" /> Moon Phase</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <span style={{ fontSize: '2.8rem' }}>{getMoonPhase(positions._moonFrac || 0).split(' ')[0]}</span>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>
                                    {getMoonPhase(positions._moonFrac || 0).split(' ').slice(1).join(' ')}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    Illumination: {((positions._moonFrac || 0) < 0.5 ? (positions._moonFrac || 0) * 2 * 100 : (1 - (positions._moonFrac || 0)) * 2 * 100).toFixed(0)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card animate-in stagger-4" style={{ padding: 0, overflow: 'hidden' }}>
                        {/* Dynamic header */}
                        <div className="card-header" style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="card-title">
                                {showPlanets && showConstellations && showDSO ? <><IoPlanet className="card-icon" /> All Sky Objects</> :
                                    !showPlanets && !showConstellations && !showDSO ? <><IoFilter className="card-icon" /> Sky Objects</> :
                                        <><IoFilter className="card-icon" /> Sky Objects</>}
                            </div>
                            <span className="tag">
                                {[showPlanets && '🪐', showConstellations && '⭐', showDSO && '🔭'].filter(Boolean).join(' ') || 'None'}
                            </span>
                        </div>
                        <div style={{ maxHeight: 400, overflowY: 'auto' }}>

                            {/* ── Planets Section ── */}
                            {showPlanets && (
                                <>
                                    {(showConstellations || showDSO) && (
                                        <div style={{ padding: '8px 16px', background: 'rgba(255,215,61,0.06)', borderBottom: '1px solid rgba(255,215,61,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <IoSunny style={{ color: '#FFD93D', fontSize: '0.8rem' }} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FFD93D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rise & Set Times</span>
                                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Next 24h</span>
                                        </div>
                                    )}
                                    {['Sun', 'Moon', 'Venus', 'Mars', 'Jupiter', 'Saturn'].map((name) => {
                                        const body = BODIES.find(b => b.id === name);
                                        const times = riseSet[name];
                                        const isAbove = positions[name]?.alt > 0;
                                        return (
                                            <div key={name} onClick={() => onSelect(name)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', padding: '8px 16px',
                                                    background: selectedId === name ? 'rgba(6,214,160,0.08)' : 'transparent',
                                                    cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                    transition: 'background 0.2s'
                                                }}>
                                                <span style={{ fontSize: '1rem', width: 26, marginRight: 8 }}>{body?.emoji}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: 1 }}>{name}</div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                                                        {times?.rise && <span>🌅 {new Date(times.rise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                                                        {times?.set && <span>🌇 {new Date(times.set).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                                                    </div>
                                                </div>
                                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: isAbove ? '#06D6A0' : '#333', boxShadow: isAbove ? '0 0 5px #06D6A0' : 'none' }} />
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {/* ── Constellations Section ── */}
                            {showConstellations && (
                                <>
                                    {(showPlanets || showDSO) && (
                                        <div style={{ padding: '8px 16px', background: 'rgba(76,201,240,0.06)', borderBottom: '1px solid rgba(76,201,240,0.1)', borderTop: showPlanets ? '1px solid rgba(255,255,255,0.08)' : 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <IoStar style={{ color: '#4cc9f0', fontSize: '0.8rem' }} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4cc9f0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Constellations</span>
                                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{CONSTELLATIONS.length} patterns</span>
                                        </div>
                                    )}
                                    {CONSTELLATIONS.map((c) => {
                                        const p = positions[c.id];
                                        const isAbove = p?.alt > 0;
                                        return (
                                            <div key={c.id} onClick={() => onSelect(c.id)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', padding: '8px 16px',
                                                    background: selectedId === c.id ? 'rgba(6,214,160,0.08)' : 'transparent',
                                                    cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                    transition: 'background 0.2s'
                                                }}>
                                                <span style={{ fontSize: '1rem', width: 26, marginRight: 8 }}>{c.emoji}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: 1 }}>{c.name}</div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                                                        <span>🌌 {c.season}</span>
                                                        <span>⭐ {c.stars} stars</span>
                                                        {p && <span style={{ color: isAbove ? '#06D6A0' : 'var(--text-muted)' }}>Alt {p.alt.toFixed(0)}°</span>}
                                                    </div>
                                                </div>
                                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: isAbove ? '#06D6A0' : '#333', boxShadow: isAbove ? '0 0 5px #06D6A0' : 'none' }} />
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {/* ── Deep Sky Objects Section ── */}
                            {showDSO && (
                                <>
                                    {(showPlanets || showConstellations) && (
                                        <div style={{ padding: '8px 16px', background: 'rgba(160,160,160,0.06)', borderBottom: '1px solid rgba(160,160,160,0.1)', borderTop: (showPlanets || showConstellations) ? '1px solid rgba(255,255,255,0.08)' : 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <IoSearch style={{ color: '#a0a0a0', fontSize: '0.8rem' }} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deep Sky Objects</span>
                                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{DEEP_SKY.length} objects</span>
                                        </div>
                                    )}
                                    {DEEP_SKY.map((d) => {
                                        const p = positions[d.id];
                                        const isAbove = p?.alt > 0;
                                        return (
                                            <div key={d.id} onClick={() => onSelect(d.id)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', padding: '8px 16px',
                                                    background: selectedId === d.id ? 'rgba(6,214,160,0.08)' : 'transparent',
                                                    cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                    transition: 'background 0.2s'
                                                }}>
                                                <span style={{ fontSize: '1rem', width: 26, marginRight: 8 }}>{d.emoji}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: 1 }}>{d.name} <span style={{ color: 'var(--accent-cyan)', fontSize: '0.65rem' }}>{d.label}</span></div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                                                        {d.desc.slice(0, 55)}…
                                                    </div>
                                                </div>
                                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: isAbove ? '#06D6A0' : '#333', boxShadow: isAbove ? '0 0 5px #06D6A0' : 'none' }} />
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {/* Nothing active */}
                            {!showPlanets && !showConstellations && !showDSO && (
                                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    Toggle a filter above to see sky objects here.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SkyMap() {
    return (
        <ErrorBoundary>
            <SkyMapContent />
        </ErrorBoundary>
    );
}
