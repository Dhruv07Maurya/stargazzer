import { useState, useEffect } from 'react';
import { IoRocket, IoSunny, IoTelescope, IoEarth, IoNotifications, IoFlash } from 'react-icons/io5';
import { getUpcomingLaunches, getISSPosition, getSpaceWeatherSummary, getAPOD, getEONETEvents } from '../services/api';

function CountdownTimer({ targetDate }) {
    const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        const update = () => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) return setTime({ days: 0, hours: 0, mins: 0, secs: 0 });
            setTime({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                mins: Math.floor((diff % 3600000) / 60000),
                secs: Math.floor((diff % 60000) / 1000),
            });
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="countdown">
            {[
                { val: time.days, label: 'Days' },
                { val: time.hours, label: 'Hrs' },
                { val: time.mins, label: 'Min' },
                { val: time.secs, label: 'Sec' },
            ].map((u, i) => (
                <span key={i} style={{ display: 'contents' }}>
                    {i > 0 && <span className="countdown-sep">:</span>}
                    <div className="countdown-unit">
                        <span className="countdown-value">{String(u.val).padStart(2, '0')}</span>
                        <span className="countdown-label">{u.label}</span>
                    </div>
                </span>
            ))}
        </div>
    );
}

export default function Home() {
    const [launches, setLaunches] = useState(null);
    const [iss, setISS] = useState(null);
    const [weatherSummary, setWeatherSummary] = useState(null);
    const [apod, setAPOD] = useState(null);
    const [events, setEvents] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [l, i, w, a, e] = await Promise.all([
                getUpcomingLaunches(3),
                getISSPosition(),
                getSpaceWeatherSummary(),
                getAPOD(),
                getEONETEvents(5),
            ]);
            setLaunches(l); setISS(i); setWeatherSummary(w); setAPOD(a); setEvents(e);
            setLoading(false);
        }
        load();
    }, []);

    const activityColors = {
        'Quiet': 'success', 'Unsettled': 'info', 'Active': 'warning', 'Storm': 'danger', 'Extreme Storm': 'danger'
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>🌌 Dashboard</h1>
                <p>What matters right now — your 10-second space snapshot</p>
            </div>

            {/* Row 1: Next Launch + Space Weather + ISS */}
            <div className="grid-3" style={{ marginBottom: 20, alignItems: 'stretch' }}>
                {/* Next Launch Card */}
                <div className="glass-card animate-in stagger-1" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="card-header">
                        <div className="card-title"><IoRocket className="card-icon" /> Next Launch</div>
                        {launches?.[0]?.status && (
                            <span className={`status-badge ${launches[0].status === 'Go for Launch' ? 'success' : 'info'}`}>
                                <span className="status-dot"></span>
                                {launches[0].status}
                            </span>
                        )}
                    </div>
                    {loading ? (
                        <div><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-text"></div></div>
                    ) : launches?.[0] ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {launches[0].image && (
                                <img src={launches[0].image} alt={launches[0].name}
                                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 12 }}
                                    onError={e => e.target.style.display = 'none'} />
                            )}
                            <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{launches[0].name}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                                {launches[0].provider} • {launches[0].pad?.location || ''}
                            </p>
                            {launches[0].mission && (
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                                    {launches[0].mission.description?.slice(0, 100)}...
                                </p>
                            )}
                            <CountdownTimer targetDate={launches[0].net} />
                            <a
                                href={launches[0].url || `https://ll.thespacedevs.com/2.2.0/launch/${launches[0].id}/`}
                                target="_blank" rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12,
                                    padding: '7px 14px', background: 'rgba(6,214,160,0.1)', color: 'var(--accent-cyan)',
                                    borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6,214,160,0.25)',
                                    textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s',
                                }}
                            >
                                🔗 Read more about this launch
                            </a>
                        </div>
                    ) : <div className="empty-state"><p>No upcoming launches</p></div>}
                </div>

                {/* Space Weather Card */}
                <div className="glass-card animate-in stagger-2" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="card-header">
                        <div className="card-title"><IoSunny className="card-icon" /> Space Weather</div>
                        {weatherSummary && (
                            <span className={`status-badge ${activityColors[weatherSummary.activityLevel] || 'info'}`}>
                                <span className="status-dot"></span>
                                {weatherSummary.activityLevel}
                            </span>
                        )}
                    </div>
                    {loading ? (
                        <div><div className="skeleton skeleton-card" style={{ height: 80 }}></div></div>
                    ) : weatherSummary ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                                <div className="metric-card">
                                    <div className="metric-value" style={{ fontSize: '1.6rem' }}>{weatherSummary.kpIndex}</div>
                                    <div className="metric-label">Kp Index</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value" style={{ fontSize: '1.6rem' }}>{weatherSummary.recentFlares}</div>
                                    <div className="metric-label">Flares (7d)</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value" style={{ fontSize: '1.6rem' }}>{weatherSummary.activeAlerts}</div>
                                    <div className="metric-label">Alerts</div>
                                </div>
                            </div>
                            <div className="gauge-bar">
                                <div
                                    className={`gauge-fill ${weatherSummary.kpIndex >= 5 ? 'high' : weatherSummary.kpIndex >= 3 ? 'medium' : 'low'}`}
                                    style={{ width: `${(weatherSummary.kpIndex / 9) * 100}%` }}
                                ></div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, marginBottom: 12 }}>
                                Strongest flare: {weatherSummary.strongestRecentFlare}
                            </p>

                            {/* Condition details */}
                            <div style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', marginBottom: 12 }}>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
                                    {weatherSummary.kpIndex >= 7 ? '🔴 Extreme geomagnetic storm — satellite and power grid disruptions possible. Aurora visible at mid-latitudes.'
                                        : weatherSummary.kpIndex >= 5 ? '🟠 Geomagnetic storm in progress — HF radio may be affected. Aurora visible at higher latitudes.'
                                            : weatherSummary.kpIndex >= 3 ? '🟡 Unsettled conditions — minor geomagnetic activity. Possible aurora at polar regions.'
                                                : '🟢 Quiet conditions — no significant geomagnetic activity. Solar wind is within normal levels.'}
                                </p>
                                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    Kp scale: 0-3 Quiet • 4-5 Active • 6-7 Storm • 8-9 Extreme
                                </p>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                                <a href="https://www.swpc.noaa.gov/" target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(6,214,160,0.1)', color: 'var(--accent-cyan)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6,214,160,0.25)', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600 }}>
                                    🔗 NOAA Space Weather
                                </a>
                            </div>
                        </div>
                    ) : <div className="empty-state"><p>Data unavailable</p></div>}
                </div>

                {/* ISS Tracker Card */}
                <div className="glass-card animate-in stagger-3" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="card-header">
                        <div className="card-title"><IoFlash className="card-icon" /> ISS Live Position</div>
                        <span className="status-badge success"><span className="status-dot"></span>Live</span>
                    </div>
                    {loading ? (
                        <div><div className="skeleton skeleton-card" style={{ height: 80 }}></div></div>
                    ) : iss ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
                                <div className="metric-card">
                                    <div className="metric-value" style={{ fontSize: '1.3rem' }}>{iss.latitude?.toFixed(2)}°</div>
                                    <div className="metric-label">Latitude</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value" style={{ fontSize: '1.3rem' }}>{iss.longitude?.toFixed(2)}°</div>
                                    <div className="metric-label">Longitude</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                                <div className="metric-card">
                                    <div className="metric-value" style={{ fontSize: '1.1rem' }}>~408 km</div>
                                    <div className="metric-label">Altitude</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value" style={{ fontSize: '1.1rem' }}>27,600</div>
                                    <div className="metric-label">km/h Speed</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value" style={{ fontSize: '1.1rem' }}>~92 min</div>
                                    <div className="metric-label">Orbit Period</div>
                                </div>
                            </div>

                            {/* ISS info box */}
                            <div style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', marginBottom: 12 }}>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    🛰️ The International Space Station orbits Earth every ~92 minutes at 27,600 km/h. It's the largest human-made object in space and continuously occupied since Nov 2000.
                                </p>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                                <a href="https://spotthestation.nasa.gov/" target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(6,214,160,0.1)', color: 'var(--accent-cyan)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6,214,160,0.25)', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600 }}>
                                    🔗 Spot the Station (NASA)
                                </a>
                            </div>
                        </div>
                    ) : <div className="empty-state"><p>ISS data unavailable</p></div>}
                </div>
            </div>

            {/* Row 2: APOD + Earth Events */}
            <div className="grid-2" style={{ marginBottom: 20 }}>
                {/* APOD Card */}
                <div className="glass-card animate-in stagger-4">
                    <div className="card-header">
                        <div className="card-title"><IoTelescope className="card-icon" /> Astronomy Picture of the Day</div>
                    </div>
                    {loading ? (
                        <div className="skeleton skeleton-card" style={{ height: 200 }}></div>
                    ) : apod ? (
                        <div>
                            {apod.media_type === 'image' && (
                                <img
                                    src={apod.url} alt={apod.title}
                                    style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 12, maxHeight: 220, objectFit: 'cover' }}
                                />
                            )}
                            <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>{apod.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                                {apod.explanation?.slice(0, 200)}...
                            </p>
                            <a
                                href={apod.hdurl || apod.url || 'https://apod.nasa.gov/apod/astropix.html'}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(6,214,160,0.1)', color: 'var(--accent-cyan)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6,214,160,0.25)', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600, marginRight: 8 }}>
                                🖼️ View Full Resolution
                            </a>
                            <a
                                href="https://apod.nasa.gov/apod/astropix.html"
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(123,97,255,0.1)', color: 'var(--accent-purple)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(123,97,255,0.25)', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600 }}>
                                🔗 NASA APOD Archive
                            </a>
                        </div>
                    ) : <div className="empty-state"><p>APOD unavailable</p></div>}
                </div>

                {/* Earth Events Card */}
                <div className="glass-card animate-in stagger-5">
                    <div className="card-header">
                        <div className="card-title"><IoEarth className="card-icon" /> Active Earth Events</div>
                        <span className="tag">EONET</span>
                    </div>
                    {loading ? (
                        <div>{[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-text" style={{ marginBottom: 16 }}></div>)}</div>
                    ) : events?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {events.slice(0, 5).map((e, i) => (
                                <div key={e.id || i} className="event-card">
                                    <div className="event-icon" style={{
                                        background: e.category === 'Wildfires' ? 'rgba(239,71,111,0.15)' :
                                            e.category === 'Severe Storms' ? 'rgba(76,201,240,0.15)' :
                                                'rgba(123,97,255,0.15)'
                                    }}>
                                        {e.category === 'Wildfires' ? '🔥' : e.category === 'Severe Storms' ? '🌀' : e.category === 'Volcanoes' ? '🌋' : '🌍'}
                                    </div>
                                    <div className="event-info">
                                        <div className="event-title">{e.title}</div>
                                        <div className="event-meta">
                                            <span>{e.category}</span>
                                            {e.geometry?.[0]?.date && <span>{new Date(e.geometry[0].date).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <div className="empty-state"><p>No active events</p></div>}
                </div>
            </div>

            {/* Row 3: More launches */}
            {launches && launches.length > 1 && (
                <div className="glass-card animate-in stagger-6">
                    <div className="card-header">
                        <div className="card-title"><IoRocket className="card-icon" /> Upcoming Launches</div>
                    </div>
                    <div className="grid-2">
                        {launches.slice(1, 3).map((l, i) => (
                            <div key={l.id || i} className="event-card" style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                                <div className="event-icon" style={{ background: 'rgba(6,214,160,0.1)' }}>🚀</div>
                                <div className="event-info">
                                    <div className="event-title" style={{ fontSize: '0.9rem' }}>{l.name}</div>
                                    <div className="event-desc">{l.provider}</div>
                                    <div className="event-meta">
                                        {l.net && <span>{new Date(l.net).toLocaleDateString()}</span>}
                                        <span>{l.pad?.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
