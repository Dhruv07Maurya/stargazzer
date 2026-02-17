import { useState, useEffect } from 'react';
import { IoSunny, IoFlash, IoWarning, IoShield, IoAnalytics } from 'react-icons/io5';
import { getSolarFlares, getGeomagneticStorms, getKpIndex, getSpaceWeatherAlerts, getCME, getSpaceWeatherSummary } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function KpGauge({ value }) {
    const levels = [
        { max: 1, label: 'Quiet', color: 'var(--accent-cyan)', desc: 'No significant activity' },
        { max: 3, label: 'Unsettled', color: 'var(--accent-blue)', desc: 'Minor fluctuations' },
        { max: 4, label: 'Active', color: 'var(--accent-gold)', desc: 'Possible weak aurora at high latitudes' },
        { max: 6, label: 'Storm', color: 'var(--accent-orange)', desc: 'Aurora visible at mid-latitudes, GPS disruption possible' },
        { max: 9, label: 'Extreme', color: 'var(--accent-red)', desc: 'Power grid issues, widespread aurora, satellite damage risk' },
    ];
    const level = levels.find(l => value <= l.max) || levels[levels.length - 1];

    return (
        <div className="glass-card animate-in stagger-1">
            <div className="card-header">
                <div className="card-title"><IoAnalytics className="card-icon" /> Geomagnetic Activity</div>
                <span className={`status-badge ${value <= 1 ? 'success' : value <= 4 ? 'warning' : 'danger'}`}>
                    <span className="status-dot"></span>{level.label}
                </span>
            </div>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div className="metric-value" style={{ fontSize: '3rem' }}>{value}</div>
                <div className="metric-label" style={{ marginBottom: 12 }}>Kp Index (0-9)</div>
                <div className="gauge-bar" style={{ height: 12 }}>
                    <div className={`gauge-fill ${value <= 2 ? 'low' : value <= 4 ? 'medium' : 'high'}`} style={{ width: `${(value / 9) * 100}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>Quiet</span><span>Active</span><span>Extreme</span>
                </div>
            </div>
            <div style={{ background: 'var(--bg-glass)', padding: 12, borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}><strong style={{ color: level.color }}>Current:</strong> {level.desc}</p>
            </div>
            <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>What is the Kp Index?</strong> It measures disturbances in Earth's magnetic field on a 0-9 scale. Higher values mean stronger geomagnetic storms.
            </div>
        </div>
    );
}

export default function SpaceWeather() {
    const [summary, setSummary] = useState(null);
    const [flares, setFlares] = useState(null);
    const [storms, setStorms] = useState(null);
    const [kpData, setKpData] = useState(null);
    const [alerts, setAlerts] = useState(null);
    const [cme, setCME] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [s, f, st, kp, a, c] = await Promise.all([
                getSpaceWeatherSummary(), getSolarFlares(), getGeomagneticStorms(),
                getKpIndex(), getSpaceWeatherAlerts(), getCME(),
            ]);
            setSummary(s); setFlares(f); setStorms(st); setKpData(kp); setAlerts(a); setCME(c);
            setLoading(false);
        }
        load();
    }, []);

    const kpChartData = kpData && Array.isArray(kpData) ? kpData.slice(-24).map((d, i) => ({
        time: d[0]?.split(' ')[1]?.slice(0, 5) || i,
        kp: parseFloat(d[1]) || 0,
    })) : [];

    const flareChartData = flares ? (() => {
        const counts = {};
        flares.forEach(f => {
            const type = f.classType?.[0] || 'Unknown';
            counts[type] = (counts[type] || 0) + 1;
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    })() : [];

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>☀️ Space Weather</h1>
                <p>What the Sun is doing — solar flares, geomagnetic storms, and their effects on Earth</p>
            </div>

            <div className="section-tabs">
                {['overview', 'flares', 'storms', 'alerts'].map(tab => (
                    <button key={tab} className={`section-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab === 'overview' ? '📊 Overview' : tab === 'flares' ? '🔥 Solar Flares' : tab === 'storms' ? '🌀 Storms & CMEs' : '⚠️ Alerts'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid-2">{[1, 2, 3, 4].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: 200 }}></div>)}</div>
            ) : (
                <>
                    {activeTab === 'overview' && (
                        <div>
                            <div className="grid-3" style={{ marginBottom: 20 }}>
                                <KpGauge value={summary?.kpIndex || 0} />
                                <div className="glass-card animate-in stagger-2">
                                    <div className="card-header">
                                        <div className="card-title"><IoFlash className="card-icon" /> Solar Flares (30 days)</div>
                                        <span className="tag">{flares?.length || 0} events</span>
                                    </div>
                                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                        <div className="metric-value">{flares?.length || 0}</div>
                                        <div className="metric-label">Total Flares</div>
                                    </div>
                                    {flareChartData.length > 0 && (
                                        <ResponsiveContainer width="100%" height={120}>
                                            <BarChart data={flareChartData}>
                                                <Bar dataKey="count" fill="#06d6a0" radius={[4, 4, 0, 0]} />
                                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                        <strong>What are solar flares?</strong> Sudden bursts of energy from the Sun. Classes: A (weakest), B, C, M, X (strongest).
                                    </p>
                                </div>
                                <div className="glass-card animate-in stagger-3">
                                    <div className="card-header">
                                        <div className="card-title"><IoWarning className="card-icon" /> Possible Effects on Earth</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {[
                                            { icon: '📡', label: 'Radio / GPS', impact: summary?.kpIndex >= 5 ? 'Possible disruption' : 'Normal operation', severity: summary?.kpIndex >= 5 ? 'warning' : 'success' },
                                            { icon: '⚡', label: 'Power Grids', impact: summary?.kpIndex >= 7 ? 'Risk of damage' : summary?.kpIndex >= 5 ? 'Possible fluctuation' : 'Stable', severity: summary?.kpIndex >= 7 ? 'danger' : summary?.kpIndex >= 5 ? 'warning' : 'success' },
                                            { icon: '🛰️', label: 'Satellites', impact: summary?.kpIndex >= 5 ? 'Drag increase' : 'Normal orbit', severity: summary?.kpIndex >= 5 ? 'warning' : 'success' },
                                            { icon: '✈️', label: 'Aviation', impact: summary?.kpIndex >= 6 ? 'HF radio blackout risk' : 'Normal', severity: summary?.kpIndex >= 6 ? 'warning' : 'success' },
                                            { icon: '🌌', label: 'Aurora', impact: summary?.kpIndex >= 4 ? 'Visible at lower latitudes!' : 'Poles only', severity: summary?.kpIndex >= 4 ? 'info' : 'success' },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                                                <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.label}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.impact}</div>
                                                </div>
                                                <span className={`status-badge ${item.severity}`} style={{ fontSize: '0.65rem' }}>
                                                    <span className="status-dot"></span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {kpChartData.length > 0 && (
                                <div className="glass-card animate-in stagger-4">
                                    <div className="card-header">
                                        <div className="card-title"><IoAnalytics className="card-icon" /> Kp Index Timeline</div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <AreaChart data={kpChartData}>
                                            <defs>
                                                <linearGradient id="kpGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#06d6a0" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
                                            <YAxis domain={[0, 9]} tick={{ fill: '#64748b', fontSize: 10 }} />
                                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                                            <Area type="monotone" dataKey="kp" stroke="#06d6a0" fill="url(#kpGrad)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'flares' && (
                        <div className="grid-auto">
                            {flares?.length > 0 ? flares.slice(0, 20).map((f, i) => (
                                <div key={f.id || i} className="glass-card animate-in">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <h3 style={{ fontSize: '1rem' }}>Solar Flare</h3>
                                        <span className={`status-badge ${f.classType?.startsWith('X') ? 'danger' : f.classType?.startsWith('M') ? 'warning' : 'info'}`}>
                                            {f.classType || 'Unknown'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <span>🕐 Start: {f.beginTime ? new Date(f.beginTime).toLocaleString() : 'N/A'}</span>
                                        <span>📈 Peak: {f.peakTime ? new Date(f.peakTime).toLocaleString() : 'N/A'}</span>
                                        <span>📍 Source: {f.sourceLocation || 'Unknown region'}</span>
                                        <span>🔢 Active Region: {f.activeRegionNum || 'N/A'}</span>
                                    </div>
                                </div>
                            )) : <div className="empty-state"><div className="empty-icon">☀️</div><h3>No recent solar flares</h3><p>The Sun is quiet right now</p></div>}
                        </div>
                    )}

                    {activeTab === 'storms' && (
                        <div>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>🌀 Geomagnetic Storms (30 days)</h2>
                            <div className="grid-auto" style={{ marginBottom: 24 }}>
                                {storms?.length > 0 ? storms.map((s, i) => (
                                    <div key={s.id || i} className="glass-card animate-in">
                                        <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>Geomagnetic Storm</h3>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                            Start: {s.startTime ? new Date(s.startTime).toLocaleString() : 'N/A'}
                                        </p>
                                        {s.kpIndex && s.kpIndex.length > 0 && (
                                            <div style={{ marginTop: 8 }}>
                                                {s.kpIndex.map((kp, j) => (
                                                    <span key={j} className={`status-badge ${kp.kpIndex >= 5 ? 'danger' : 'warning'}`} style={{ marginRight: 4, marginBottom: 4 }}>
                                                        Kp {kp.kpIndex}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )) : <div className="empty-state"><div className="empty-icon">🌀</div><h3>No recent storms</h3><p>Earth's magnetic field is stable</p></div>}
                            </div>

                            <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>💥 Coronal Mass Ejections (30 days)</h2>
                            <div className="grid-auto">
                                {cme && Array.isArray(cme) && cme.length > 0 ? cme.slice(0, 10).map((c, i) => (
                                    <div key={i} className="glass-card animate-in">
                                        <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>CME Event</h3>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                            Time: {c.startTime ? new Date(c.startTime).toLocaleString() : 'N/A'}
                                        </p>
                                        {c.note && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>{c.note?.slice(0, 150)}</p>}
                                    </div>
                                )) : <div className="empty-state"><div className="empty-icon">💥</div><h3>No recent CMEs</h3></div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'alerts' && (
                        <div className="grid-auto">
                            {alerts && Array.isArray(alerts) && alerts.length > 0 ? alerts.slice(0, 20).map((a, i) => (
                                <div key={i} className="glass-card animate-in">
                                    <div className="card-header">
                                        <div className="card-title"><IoWarning style={{ color: 'var(--accent-gold)' }} /> Alert</div>
                                    </div>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                        {typeof a === 'string' ? a : a.message || JSON.stringify(a).slice(0, 300)}
                                    </p>
                                </div>
                            )) : <div className="empty-state"><div className="empty-icon">✅</div><h3>No active alerts</h3><p>Space weather is calm</p></div>}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
