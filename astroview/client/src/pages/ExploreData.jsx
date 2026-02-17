import { useState, useEffect } from 'react';
import { IoAnalytics, IoChevronDown, IoChevronUp, IoInformationCircle, IoLink } from 'react-icons/io5';
import { getSolarWind, getKpIndex, getCME } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import * as Astronomy from 'astronomy-engine';

/**
 * ExploreData Page
 * Displays space weather charts, real-time astronomical calculations, and references.
 */
export default function ExploreData() {
    const [solarWind, setSolarWind] = useState(null);
    const [kpRaw, setKpRaw] = useState(null);
    const [cmeRaw, setCmeRaw] = useState(null);
    const [astroMetrics, setAstroMetrics] = useState(null);
    const [expanded, setExpanded] = useState({ solar: true, kp: false, cme: false, astro: true, sources: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                // 1. Fetch space weather data
                try {
                    const [sw, kp, cme] = await Promise.all([getSolarWind(), getKpIndex(), getCME()]);
                    setSolarWind(sw); setKpRaw(kp); setCmeRaw(cme);
                } catch (e) {
                    console.error('Error fetching space weather:', e);
                }

                // 2. Astronomical computations (calculated client-side)
                try {
                    const stored = localStorage.getItem('astroview_prefs');
                    const prefs = stored ? JSON.parse(stored) : { location: { lat: 28.6139, lng: 77.2090 } };
                    const lat = parseFloat(prefs.location?.lat) || 28.6139;
                    const lng = parseFloat(prefs.location?.lng) || 77.2090;
                    const date = new Date();
                    const obs = new Astronomy.Observer(lat, lng, 0);

                    // Calculations
                    const sidereal = Astronomy.SiderealTime(date);
                    const lstHours = sidereal + lng / 15;
                    const lstFormatted = `${Math.floor(lstHours % 24)}h ${Math.floor(((lstHours % 24) % 1) * 60)}m`;

                    // Body coordinates
                    const sunEqu = Astronomy.Equator('Sun', date, obs, true, true);
                    const moonEqu = Astronomy.Equator('Moon', date, obs, true, true);
                    const moonPhase = Astronomy.MoonPhase(date);

                    setAstroMetrics({
                        lst: lstFormatted,
                        sun: { ra: sunEqu?.ra?.toFixed(2) || '0.00', dec: sunEqu?.dec?.toFixed(2) || '0.00' },
                        moon: { ra: moonEqu?.ra?.toFixed(2) || '0.00', dec: moonEqu?.dec?.toFixed(2) || '0.00', phase: moonPhase?.toFixed(1) || '0.0' },
                        julian: Astronomy.JulianDate ? (typeof Astronomy.JulianDate === 'function' ? Astronomy.JulianDate(date).toFixed(5) : 'N/A') : 'N/A'
                    });
                } catch (e) {
                    console.error('Error in astronomical calculations:', e);
                }
            } catch (globalError) {
                console.error('Global load error:', globalError);
            } finally {
                setLoading(false);
            }
        }

        load();
        const interval = setInterval(load, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));

    // Data Processing for charts
    const solarWindChart = solarWind && Array.isArray(solarWind) ? solarWind.slice(-60).map((d, i) => ({
        time: d[0]?.split(' ')[1]?.slice(0, 5) || i,
        density: parseFloat(d[1]) || 0,
        speed: parseFloat(d[2]) || 0,
        temp: parseFloat(d[3]) || 0,
    })).filter(d => d.density > 0) : [];

    const kpChart = kpRaw && Array.isArray(kpRaw) ? kpRaw.slice(1, -1).slice(-48).map((d, i) => ({
        time: d[0]?.split(' ')[1]?.slice(0, 5) || i,
        kp: parseFloat(d[1]) || 0,
    })) : [];

    const dataSources = [
        { name: 'NASA Open APIs', url: 'https://api.nasa.gov/', desc: 'APOD, DONKI, EONET, EPIC, Mars Photos' },
        { name: 'Launch Library 2', url: 'https://thespacedevs.com/', desc: 'Global rocket launches from all agencies' },
        { name: 'NOAA SWPC', url: 'https://www.swpc.noaa.gov/', desc: 'Real-time space weather data' },
        { name: 'SpaceX API', url: 'https://github.com/r-spacex/SpaceX-API', desc: 'SpaceX launches and vehicles' },
        { name: 'ISRO API', url: 'https://isro.vercel.app/', desc: 'ISRO spacecrafts and launchers' },
        { name: 'Open-Meteo', url: 'https://open-meteo.com/', desc: 'Weather data for visibility scores' },
        { name: 'Astronomy Engine', url: 'https://github.com/cosinekitty/astronomy', desc: 'High-precision astronomical calculations' },
        { name: 'SunCalc', url: 'https://github.com/mourner/suncalc', desc: 'Sun/Moon position calculations' },
    ];

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>📊 Explore Data</h1>
                <p>Go deeper — raw data, graphs, and source references for advanced learners</p>
            </div>

            <div style={{ background: 'rgba(123,97,255,0.08)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <IoInformationCircle style={{ color: 'var(--accent-purple)', fontSize: '1.3rem', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    This section shows raw data from space weather and mission APIs. Each graph includes a simplified explanation.
                    Click section headers to expand/collapse.
                </p>
            </div>

            {loading ? (
                <div className="grid-2">
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: 300 }}></div>)}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Solar Wind */}
                    <div className="glass-card">
                        <button onClick={() => toggle('solar')} className="flex-between" style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-primary)' }}>
                            <div className="card-title"><IoAnalytics className="card-icon" /> Solar Wind Plasma Data</div>
                            {expanded.solar ? <IoChevronUp /> : <IoChevronDown />}
                        </button>
                        {expanded.solar && (
                            <div style={{ marginTop: 16 }}>
                                {solarWindChart.length > 0 ? (
                                    <>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                                            Solar wind speed and density over the last few hours. Higher speed/density = more solar particles hitting Earth.
                                        </p>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={solarWindChart}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
                                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                                                <Line type="monotone" dataKey="speed" stroke="#4cc9f0" strokeWidth={2} dot={false} name="Speed (km/s)" />
                                                <Line type="monotone" dataKey="density" stroke="#06d6a0" strokeWidth={2} dot={false} name="Density (p/cm³)" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                        <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                                            <strong style={{ color: 'var(--accent-cyan)' }}>What does this mean?</strong>
                                            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                                                Solar wind is a stream of charged particles flowing from the Sun. Normal speed is ~300-400 km/s.
                                                Above 600 km/s indicates enhanced solar wind that can trigger geomagnetic storms.
                                            </p>
                                        </div>
                                    </>
                                ) : <p style={{ color: 'var(--text-muted)' }}>Solar wind data unavailable</p>}
                            </div>
                        )}
                    </div>

                    {/* Kp Index Raw */}
                    <div className="glass-card">
                        <button onClick={() => toggle('kp')} className="flex-between" style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-primary)' }}>
                            <div className="card-title"><IoAnalytics className="card-icon" /> Kp Index Detailed Timeline</div>
                            {expanded.kp ? <IoChevronUp /> : <IoChevronDown />}
                        </button>
                        {expanded.kp && (
                            <div style={{ marginTop: 16 }}>
                                {kpChart.length > 0 ? (
                                    <>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <LineChart data={kpChart}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
                                                <YAxis domain={[0, 9]} tick={{ fill: '#64748b', fontSize: 10 }} />
                                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                                                <Line type="stepAfter" dataKey="kp" stroke="#f7b731" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                        <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                            Kp 0-1: Quiet | Kp 2-3: Unsettled | Kp 4: Active | Kp 5-6: Minor/Moderate Storm | Kp 7+: Severe Storm
                                        </div>
                                    </>
                                ) : <p style={{ color: 'var(--text-muted)' }}>Kp data unavailable</p>}
                            </div>
                        )}
                    </div>

                    {/* Astronomical Calculations */}
                    <div className="glass-card">
                        <button onClick={() => toggle('astro')} className="flex-between" style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-primary)' }}>
                            <div className="card-title"><IoAnalytics className="card-icon" /> Real-time Astronomical Calculations</div>
                            {expanded.astro ? <IoChevronUp /> : <IoChevronDown />}
                        </button>
                        {expanded.astro && astroMetrics && (
                            <div style={{ marginTop: 16 }}>
                                <div className="grid-2" style={{ gap: 12 }}>
                                    <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Local Sidereal Time (LST)</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{astroMetrics.lst}</div>
                                    </div>
                                    <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Julian Date</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{astroMetrics.julian}</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 12, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#fff' }}>Solar & Lunar Coordinates (J2000)</h4>
                                    <div className="grid-2" style={{ gap: 16 }}>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-yellow)', marginBottom: 4 }}>☀️ Sun</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>RA: {astroMetrics.sun.ra}h | Dec: {astroMetrics.sun.dec}°</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#C8D6E5', marginBottom: 4 }}>🌙 Moon</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>RA: {astroMetrics.moon.ra}h | Dec: {astroMetrics.moon.dec}°</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Phase: {astroMetrics.moon.phase}°</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CME Raw Data */}
                    <div className="glass-card">
                        <button onClick={() => toggle('cme')} className="flex-between" style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-primary)' }}>
                            <div className="card-title"><IoAnalytics className="card-icon" /> CME Raw Data (Last 30 Days)</div>
                            {expanded.cme ? <IoChevronUp /> : <IoChevronDown />}
                        </button>
                        {expanded.cme && (
                            <div style={{ marginTop: 16, maxHeight: 400, overflowY: 'auto' }}>
                                {cmeRaw && Array.isArray(cmeRaw) && cmeRaw.length > 0 ? (
                                    <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                                <th style={{ textAlign: 'left', padding: 8, color: 'var(--text-muted)' }}>Time</th>
                                                <th style={{ textAlign: 'left', padding: 8, color: 'var(--text-muted)' }}>Type</th>
                                                <th style={{ textAlign: 'left', padding: 8, color: 'var(--text-muted)' }}>Note</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cmeRaw.slice(0, 20).map((c, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                                    <td style={{ padding: 8, color: 'var(--text-secondary)' }}>{c.startTime ? new Date(c.startTime).toLocaleString() : 'N/A'}</td>
                                                    <td style={{ padding: 8 }}><span className="tag">{c.type || 'CME'}</span></td>
                                                    <td style={{ padding: 8, color: 'var(--text-muted)', maxWidth: 300 }}>{c.note?.slice(0, 100) || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : <p style={{ color: 'var(--text-muted)' }}>No CME data available</p>}
                            </div>
                        )}
                    </div>

                    {/* Data Sources */}
                    <div className="glass-card">
                        <button onClick={() => toggle('sources')} className="flex-between" style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-primary)' }}>
                            <div className="card-title"><IoLink className="card-icon" /> Data Sources & References</div>
                            {expanded.sources ? <IoChevronUp /> : <IoChevronDown />}
                        </button>
                        {expanded.sources && (
                            <div style={{ marginTop: 16 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {dataSources.map((s, i) => (
                                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--text-primary)', transition: 'all var(--transition-fast)' }}>
                                            <IoLink style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
