import { useState, useEffect } from 'react';
import { IoRocket, IoTime, IoGlobe, IoChevronDown, IoOpenOutline, IoClose, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { getUpcomingLaunches, getPreviousLaunches, getAgencyMissions } from '../services/api';

/* Unified card for both launches and agency missions */
function UnifiedCard({ item, type, onViewMore }) {
    // Normalize data shape — launches and wiki missions have different keys
    const image = item.image || null;
    const name = item.name || 'Unknown';
    const subtitle = type === 'launch'
        ? `${item.provider || ''} • ${item.rocket || ''}`
        : (item.description || '');
    const summary = type === 'launch'
        ? (item.mission?.description || 'Mission details not yet available.')
        : (item.summary || '');

    return (
        <div className="glass-card animate-in" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Image */}
            {image ? (
                <div style={{ position: 'relative', width: '100%', height: 170, marginBottom: 14, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-glass)' }}>
                    <img src={image} alt={name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                        onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.target.style.transform = 'scale(1)'}
                        onError={e => { e.target.parentElement.style.display = 'none'; }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }} />
                    {/* Status badge on image */}
                    {type === 'launch' && item.status && (
                        <span className={`status-badge ${item.status === 'Launch Successful' || item.success ? 'success' : item.status === 'Go for Launch' ? 'success' : item.status === 'Launch Failure' ? 'danger' : 'info'}`}
                            style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.7rem' }}>
                            <span className="status-dot"></span>
                            {item.success !== undefined ? (item.success ? 'Success' : 'Failed') : item.status}
                        </span>
                    )}
                </div>
            ) : (
                <div style={{ width: '100%', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(6,214,160,0.08), rgba(123,97,255,0.08))', marginBottom: 14, fontSize: '2.5rem', position: 'relative' }}>
                    {type === 'launch' ? '🚀' : '🛰️'}
                    {type === 'launch' && item.status && (
                        <span className={`status-badge ${item.success ? 'success' : item.status === 'Go for Launch' ? 'success' : 'info'}`}
                            style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.7rem' }}>
                            {item.success !== undefined ? (item.success ? 'Success' : 'Failed') : item.status}
                        </span>
                    )}
                </div>
            )}

            {/* Title */}
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>{name}</h3>

            {/* Subtitle — provider/rocket for launches, description for wiki */}
            {subtitle && (
                <p style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginBottom: 8, textTransform: type === 'wiki' ? 'capitalize' : 'none' }}>{subtitle}</p>
            )}

            {/* Date + location for launches */}
            {type === 'launch' && (
                <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10, flexWrap: 'wrap' }}>
                    {item.net && (() => {
                        const d = new Date(item.net);
                        return !isNaN(d.getTime()) ? (
                            <span><IoTime style={{ verticalAlign: 'middle', marginRight: 3 }} />{d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        ) : null;
                    })()}
                    {item.pad?.location && <span><IoGlobe style={{ verticalAlign: 'middle', marginRight: 3 }} />{item.pad.location}</span>}
                </div>
            )}

            {/* Summary */}
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 14, flex: 1 }}>
                {summary.length > 150 ? summary.slice(0, 150) + '…' : summary}
            </p>

            {/* View More button */}
            <button onClick={() => onViewMore({ ...item, _type: type, _fullSummary: summary })}
                style={{ width: '100%', padding: '10px 0', border: '1px solid rgba(6,214,160,0.3)', borderRadius: 'var(--radius-sm)', background: 'rgba(6,214,160,0.06)', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
                onMouseOver={e => { e.target.style.background = 'rgba(6,214,160,0.15)'; e.target.style.borderColor = 'rgba(6,214,160,0.5)'; }}
                onMouseOut={e => { e.target.style.background = 'rgba(6,214,160,0.06)'; e.target.style.borderColor = 'rgba(6,214,160,0.3)'; }}>
                View More Details <IoChevronDown style={{ pointerEvents: 'none' }} />
            </button>
        </div>
    );
}

/* Detail modal — works for both launches and wiki missions */
function DetailModal({ item, onClose }) {
    if (!item) return null;
    const isLaunch = item._type === 'launch';
    const summary = item._fullSummary || item.summary || item.mission?.description || '';

    return (
        <div onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: 20, animation: 'fadeIn 0.2s ease' }}>
            <div onClick={e => e.stopPropagation()}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', maxWidth: 640, width: '100%', maxHeight: '85vh', overflow: 'auto', position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
                <button onClick={onClose}
                    style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    <IoClose />
                </button>

                {item.image && (
                    <img src={item.image} alt={item.name}
                        style={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}
                        onError={e => e.target.style.display = 'none'} />
                )}

                <div style={{ padding: 28 }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 6 }}>{item.name}</h2>

                    {isLaunch ? (
                        <>
                            {/* Launch-specific info */}
                            <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: 12 }}>
                                {item.provider} • {item.rocket}
                            </p>

                            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                                {item.status && (
                                    <span className={`status-badge ${item.success ? 'success' : item.status === 'Go for Launch' ? 'success' : item.status === 'Launch Failure' ? 'danger' : 'info'}`}>
                                        {item.success !== undefined ? (item.success ? '✅ Success' : '❌ Failed') : item.status}
                                    </span>
                                )}
                                {item.mission?.type && <span className="tag">{item.mission.type}</span>}
                                {item.mission?.orbit && <span className="tag">{item.mission.orbit}</span>}
                            </div>

                            {/* Date & location */}
                            <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {item.net && (() => {
                                    const d = new Date(item.net);
                                    return !isNaN(d.getTime()) ? (
                                        <span><IoTime style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                            {d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    ) : null;
                                })()}
                            </div>
                            {item.pad && (
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                                    <IoGlobe style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                    {item.pad.name} — {item.pad.location}{item.pad.country ? ` (${item.pad.country})` : ''}
                                </div>
                            )}

                            {/* Mission info */}
                            {item.mission && (
                                <div style={{ marginBottom: 16 }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8, color: 'var(--accent-cyan)' }}>
                                        Mission: {item.mission.name}
                                    </h3>
                                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                        {item.mission.description || 'Detailed mission description not available.'}
                                    </p>
                                </div>
                            )}

                            {/* Source link */}
                            <div style={{ padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-cyan)' }}>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                                    🚀 Data sourced from Launch Library 2, providing real-time launch information from all agencies worldwide.
                                </p>
                                <a href="https://thespacedevs.com/" target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(6,214,160,0.12)', color: 'var(--accent-cyan)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6,214,160,0.3)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
                                    <IoOpenOutline /> The Space Devs
                                </a>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Wiki mission info */}
                            {item.description && <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: 16, textTransform: 'capitalize' }}>{item.description}</p>}
                            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{summary}</p>
                            <div style={{ padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-cyan)' }}>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                                    📖 Data sourced from Wikipedia. Click below for the full article.
                                </p>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {item.sourceUrl && (
                                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(6,214,160,0.12)', color: 'var(--accent-cyan)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6,214,160,0.3)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
                                            <IoOpenOutline /> Read Full Article
                                        </a>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* Agency section with hero + mission/launcher grids */
function AgencySection({ data, onViewMore, agencyInfo }) {
    if (!data) return (
        <div className="grid-auto">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: 280 }}></div>)}
        </div>
    );
    const missions = data.missions || [];
    const launchers = data.launchers || [];

    return (
        <div>
            <div className="glass-card" style={{ marginBottom: 24, background: `linear-gradient(135deg, ${agencyInfo.gradientStart}, ${agencyInfo.gradientEnd})`, borderColor: agencyInfo.borderColor }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                    <span style={{ fontSize: '2.5rem' }}>{agencyInfo.icon}</span>
                    <div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>{agencyInfo.name}</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{agencyInfo.tagline}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {agencyInfo.stats.map((s, i) => (
                        <div key={i} className="metric-card" style={{ minWidth: 80 }}>
                            <div className="metric-value" style={{ fontSize: '1.4rem' }}>{s.val}</div>
                            <div className="metric-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                🛰️ Key Missions <span className="tag">{missions.length}</span>
            </h3>
            {missions.length > 0 ? (
                <div className="grid-auto" style={{ marginBottom: 28 }}>
                    {missions.map((m, i) => <UnifiedCard key={m.name || i} item={m} type="wiki" onViewMore={onViewMore} />)}
                </div>
            ) : (
                <div className="empty-state" style={{ marginBottom: 28 }}><div className="empty-icon">🛰️</div><h3>Mission data loading...</h3></div>
            )}

            {launchers.length > 0 && (
                <>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        🚀 Launch Vehicles <span className="tag">{launchers.length}</span>
                    </h3>
                    <div className="grid-auto">
                        {launchers.map((l, i) => <UnifiedCard key={l.name || i} item={l} type="wiki" onViewMore={onViewMore} />)}
                    </div>
                </>
            )}
        </div>
    );
}

const AGENCY_INFO = {
    isro: {
        icon: '🇮🇳', name: 'Indian Space Research Organisation (ISRO)',
        tagline: 'Founded 1969 • One of the world\'s most cost-effective space agencies',
        gradientStart: 'rgba(6,214,160,0.08)', gradientEnd: 'rgba(76,201,240,0.05)', borderColor: 'rgba(6,214,160,0.2)',
        stats: [{ val: '24', label: 'Missions' }, { val: '7', label: 'Launchers' }, { val: '4th', label: 'Moon Landing' }, { val: '1st', label: 'Mars (Asia)' }],
    },
    nasa: {
        icon: '🚀', name: 'National Aeronautics and Space Administration (NASA)',
        tagline: 'Founded 1958 • Pioneering the future in space exploration and scientific discovery',
        gradientStart: 'rgba(76,201,240,0.08)', gradientEnd: 'rgba(123,97,255,0.05)', borderColor: 'rgba(76,201,240,0.2)',
        stats: [{ val: '24', label: 'Missions' }, { val: '3', label: 'Launchers' }, { val: '12', label: 'Moon Walkers' }, { val: '5', label: 'Mars Rovers' }],
    },
    spacex: {
        icon: '🧑‍🚀', name: 'SpaceX',
        tagline: 'Founded 2002 by Elon Musk • Making life multi-planetary',
        gradientStart: 'rgba(123,97,255,0.08)', gradientEnd: 'rgba(239,71,111,0.05)', borderColor: 'rgba(123,97,255,0.2)',
        stats: [{ val: '11', label: 'Programs' }, { val: '3', label: 'Rockets' }, { val: '200+', label: 'Launches' }, { val: '6000+', label: 'Starlinks' }],
    },
};

export default function Missions() {
    const [upcoming, setUpcoming] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [agencyData, setAgencyData] = useState({});
    const [loadingAgency, setLoadingAgency] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [u, p] = await Promise.all([getUpcomingLaunches(12), getPreviousLaunches(12)]);
            setUpcoming(u || []);
            setPrevious(p || []);
            setLoading(false);
        }
        load();
    }, []);

    useEffect(() => {
        const agencies = ['isro', 'nasa', 'spacex'];
        if (!agencies.includes(activeTab)) return;
        if (agencyData[activeTab]) return;
        setLoadingAgency(prev => ({ ...prev, [activeTab]: true }));
        getAgencyMissions(activeTab).then(data => {
            setAgencyData(prev => ({ ...prev, [activeTab]: data || { missions: [], launchers: [] } }));
            setLoadingAgency(prev => ({ ...prev, [activeTab]: false }));
        });
    }, [activeTab]);

    const TABS = [
        { id: 'upcoming', label: '🚀 Upcoming Launches' },
        { id: 'previous', label: '📜 Past Launches' },
        { id: 'isro', label: '🇮🇳 ISRO' },
        { id: 'nasa', label: '🔭 NASA' },
        { id: 'spacex', label: '🧑‍🚀 SpaceX' },
    ];

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>🚀 Missions & Launches</h1>
                <p>What humans are doing in space — launches and missions from top space agencies</p>
            </div>

            <div className="section-tabs" style={{ flexWrap: 'wrap' }}>
                {TABS.map(tab => (
                    <button key={tab.id} className={`section-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Upcoming Launches */}
            {activeTab === 'upcoming' && (
                loading ? (
                    <div className="grid-auto">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: 280 }}></div>)}</div>
                ) : (
                    <>
                        <div className="glass-card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(6,214,160,0.08), rgba(76,201,240,0.05))', borderColor: 'rgba(6,214,160,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: '2rem' }}>🚀</span>
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 2 }}>Upcoming Launches</h2>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Live data from Launch Library 2 — all agencies worldwide</p>
                                </div>
                                <span className="tag" style={{ marginLeft: 'auto' }}>{Array.isArray(upcoming) ? upcoming.length : 0} launches</span>
                            </div>
                        </div>
                        <div className="grid-auto">
                            {Array.isArray(upcoming) && upcoming.length > 0 ? upcoming.map((l, i) => (
                                <UnifiedCard key={l.id || i} item={l} type="launch" onViewMore={setSelectedItem} />
                            )) : <div className="empty-state"><div className="empty-icon">🚀</div><h3>No upcoming launches available</h3></div>}
                        </div>
                    </>
                )
            )}

            {/* Past Launches */}
            {activeTab === 'previous' && (
                loading ? (
                    <div className="grid-auto">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: 280 }}></div>)}</div>
                ) : (
                    <>
                        <div className="glass-card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(123,97,255,0.08), rgba(76,201,240,0.05))', borderColor: 'rgba(123,97,255,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: '2rem' }}>📜</span>
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 2 }}>Past Launches</h2>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Recent completed launches from all agencies</p>
                                </div>
                                <span className="tag" style={{ marginLeft: 'auto' }}>{Array.isArray(previous) ? previous.length : 0} launches</span>
                            </div>
                        </div>
                        <div className="grid-auto">
                            {Array.isArray(previous) && previous.length > 0 ? previous.map((l, i) => (
                                <UnifiedCard key={l.id || i} item={l} type="launch" onViewMore={setSelectedItem} />
                            )) : <div className="empty-state"><div className="empty-icon">📜</div><h3>No past launches available</h3></div>}
                        </div>
                    </>
                )
            )}

            {/* Agency Tabs */}
            {['isro', 'nasa', 'spacex'].includes(activeTab) && (
                loadingAgency[activeTab] ? (
                    <div>
                        <div className="glass-card" style={{ marginBottom: 24 }}>
                            <div className="skeleton skeleton-title" style={{ width: '60%', marginBottom: 12 }}></div>
                            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                        </div>
                        <div className="grid-auto">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: 280 }}></div>)}</div>
                    </div>
                ) : (
                    <AgencySection data={agencyData[activeTab]} onViewMore={setSelectedItem} agencyInfo={AGENCY_INFO[activeTab]} />
                )
            )}

            <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    );
}
