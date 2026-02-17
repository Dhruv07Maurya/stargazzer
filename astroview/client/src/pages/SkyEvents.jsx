import { useState, useEffect } from 'react';
import { IoMoon, IoStar, IoPlanet, IoEye, IoCompass, IoWater } from 'react-icons/io5';
import { getISSDetail, getAPOD, getWeather } from '../services/api';
import meteorShowers from '../data/meteorShowers';
import SunCalc from 'suncalc';

function MoonPhaseCard() {
    const now = new Date();
    const moon = SunCalc.getMoonIllumination(now);
    const phaseNames = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const phaseEmoji = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    const idx = Math.round(moon.phase * 8) % 8;

    return (
        <div className="glass-card animate-in stagger-2">
            <div className="card-header">
                <div className="card-title"><IoMoon className="card-icon" /> Lunar Phase</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: 8 }}>{phaseEmoji[idx]}</div>
                <h3 style={{ marginBottom: 4 }}>{phaseNames[idx]}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {(moon.fraction * 100).toFixed(1)}% illuminated
                </p>
                <div className="gauge-bar" style={{ marginTop: 12, maxWidth: 200, margin: '12px auto 0' }}>
                    <div className="gauge-fill low" style={{ width: `${moon.fraction * 100}%` }}></div>
                </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 12 }}>
                <strong>Why it matters:</strong> Moon brightness affects sky visibility. Darker phases are better for stargazing and meteor watching.
            </p>
        </div>
    );
}

function SunTimesCard() {
    const [loc, setLoc] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                p => setLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
                () => setLoc({ lat: 28.6139, lng: 77.2090 }) // default New Delhi
            );
        } else {
            setLoc({ lat: 28.6139, lng: 77.2090 });
        }
    }, []);

    if (!loc) return null;

    const times = SunCalc.getTimes(new Date(), loc.lat, loc.lng);
    const moonTimes = SunCalc.getMoonTimes(new Date(), loc.lat, loc.lng);
    const fmt = d => d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

    return (
        <div className="glass-card animate-in stagger-3">
            <div className="card-header">
                <div className="card-title">☀️ Sun & Moon Times</div>
                <span className="tag">Local</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                    { label: 'Sunrise', value: fmt(times.sunrise), icon: '🌅' },
                    { label: 'Sunset', value: fmt(times.sunset), icon: '🌇' },
                    { label: 'Golden Hour', value: fmt(times.goldenHour), icon: '✨' },
                    { label: 'Astro Twilight', value: fmt(times.nightEnd), icon: '🌌' },
                    { label: 'Moonrise', value: fmt(moonTimes.rise), icon: '🌙' },
                    { label: 'Moonset', value: fmt(moonTimes.set), icon: '🌑' },
                ].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.label}</div>
                            <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>{t.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SkyEvents() {
    const [issDetail, setISSDetail] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        getISSDetail().then(setISSDetail);
    }, []);

    const now = new Date();
    const currentMonth = now.getMonth();

    const upcoming = meteorShowers.filter(s => {
        const peakMonth = new Date(`${s.peak.split(' ')[0]} 1`).getMonth();
        return peakMonth >= currentMonth;
    });
    const past = meteorShowers.filter(s => {
        const peakMonth = new Date(`${s.peak.split(' ')[0]} 1`).getMonth();
        return peakMonth < currentMonth;
    });
    const sortedShowers = [...upcoming, ...past];

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>🌠 Sky Events</h1>
                <p>What can I see tonight? — ISS passes, meteor showers, moon phases, and more</p>
            </div>

            <div className="section-tabs">
                {['overview', 'meteors', 'iss'].map(tab => (
                    <button key={tab} className={`section-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab === 'overview' ? '🌌 Overview' : tab === 'meteors' ? '☄️ Meteor Showers' : '🛰️ ISS Tracker'}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div>
                    <div className="grid-2" style={{ marginBottom: 20 }}>
                        <MoonPhaseCard />
                        <SunTimesCard />
                    </div>

                    {/* Quick meteor shower preview */}
                    <div className="glass-card animate-in stagger-4">
                        <div className="card-header">
                            <div className="card-title"><IoStar className="card-icon" /> Upcoming Meteor Showers</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {sortedShowers.slice(0, 3).map(s => (
                                <div key={s.id} className="event-card">
                                    <div className="event-icon" style={{ background: s.zhr >= 100 ? 'rgba(6,214,160,0.15)' : 'rgba(123,97,255,0.15)' }}>
                                        ☄️
                                    </div>
                                    <div className="event-info">
                                        <div className="event-title">{s.name}</div>
                                        <div className="event-desc">{s.description}</div>
                                        <div className="event-meta">
                                            <span>Peak: {s.peak}</span>
                                            <span>ZHR: {s.zhr}/hr</span>
                                            <span>Speed: {s.speed} km/s</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'meteors' && (
                <div className="grid-auto">
                    {sortedShowers.map(s => (
                        <div key={s.id} className="glass-card animate-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <h3 style={{ fontSize: '1.1rem' }}>☄️ {s.name}</h3>
                                <span className={`status-badge ${s.zhr >= 100 ? 'success' : s.zhr >= 50 ? 'info' : 'warning'}`}>
                                    {s.zhr >= 100 ? 'Major' : s.zhr >= 50 ? 'Moderate' : 'Minor'}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>{s.description}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.8rem', marginBottom: 12 }}>
                                <div><span style={{ color: 'var(--text-muted)' }}>Peak:</span> {s.peak}</div>
                                <div><span style={{ color: 'var(--text-muted)' }}>ZHR:</span> {s.zhr}/hr</div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Speed:</span> {s.speed} km/s</div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Radiant:</span> {s.radiant}</div>
                                <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--text-muted)' }}>Parent:</span> {s.parent}</div>
                            </div>
                            {s.whyItHappens && (
                                <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', padding: 12, fontSize: '0.8rem' }}>
                                    <strong style={{ color: 'var(--accent-cyan)' }}>Why does this happen?</strong>
                                    <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{s.whyItHappens}</p>
                                </div>
                            )}
                            {s.bestViewing && (
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                    <IoEye style={{ verticalAlign: 'middle' }} /> {s.bestViewing}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'iss' && (
                <div className="grid-2">
                    <div className="glass-card animate-in">
                        <div className="card-header">
                            <div className="card-title">🛰️ ISS Live Data</div>
                            <span className="status-badge success"><span className="status-dot"></span>Orbiting</span>
                        </div>
                        {issDetail ? (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                    <div className="metric-card">
                                        <div className="metric-value" style={{ fontSize: '1.3rem' }}>{issDetail.latitude?.toFixed(4)}°</div>
                                        <div className="metric-label">Latitude</div>
                                    </div>
                                    <div className="metric-card">
                                        <div className="metric-value" style={{ fontSize: '1.3rem' }}>{issDetail.longitude?.toFixed(4)}°</div>
                                        <div className="metric-label">Longitude</div>
                                    </div>
                                    <div className="metric-card">
                                        <div className="metric-value" style={{ fontSize: '1.3rem' }}>{issDetail.altitude?.toFixed(1)} km</div>
                                        <div className="metric-label">Altitude</div>
                                    </div>
                                    <div className="metric-card">
                                        <div className="metric-value" style={{ fontSize: '1.3rem' }}>{issDetail.velocity?.toFixed(0)} km/h</div>
                                        <div className="metric-label">Velocity</div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    Visibility: <strong>{issDetail.visibility || 'N/A'}</strong>
                                </p>
                            </div>
                        ) : <div className="skeleton skeleton-card" style={{ height: 140 }}></div>}
                    </div>
                    <div className="glass-card animate-in stagger-1">
                        <div className="card-header">
                            <div className="card-title"><IoCompass className="card-icon" /> About the ISS</div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            The <strong>International Space Station</strong> is humanity's home in space, orbiting Earth at ~408 km altitude.
                            It completes one orbit every <strong>~90 minutes</strong>, traveling at about 27,600 km/h.
                        </p>
                        <div style={{ marginTop: 16, background: 'var(--bg-glass)', padding: 12, borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                            <strong style={{ color: 'var(--accent-cyan)' }}>Can you see it?</strong>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                                Yes! The ISS is visible to the naked eye as a bright, fast-moving "star" during dawn or dusk.
                                It's the third brightest object in the night sky.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
