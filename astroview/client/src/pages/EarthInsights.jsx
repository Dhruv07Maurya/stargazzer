import { useState, useEffect } from 'react';
import { IoEarth, IoFlame, IoThunderstorm, IoLeaf, IoWater, IoImage } from 'react-icons/io5';
import { getEONETEvents, getEPICImages } from '../services/api';

const categoryIcons = {
    'Wildfires': '🔥',
    'Severe Storms': '🌀',
    'Volcanoes': '🌋',
    'Floods': '🌊',
    'Earthquakes': '🌍',
    'Drought': '☀️',
    'Sea and Lake Ice': '🧊',
    'Snow': '❄️',
    'Landslides': '⛰️',
    'Dust and Haze': '🌫️',
    'Temperature Extremes': '🌡️',
    'Water Color': '💧',
    'Manmade': '🏭',
};

const categoryColors = {
    'Wildfires': 'rgba(239,71,111,0.15)',
    'Severe Storms': 'rgba(76,201,240,0.15)',
    'Volcanoes': 'rgba(255,107,53,0.15)',
    'Floods': 'rgba(76,201,240,0.15)',
    'Sea and Lake Ice': 'rgba(123,97,255,0.15)',
};

export default function EarthInsights() {
    const [events, setEvents] = useState(null);
    const [epicImages, setEpicImages] = useState(null);
    const [activeTab, setActiveTab] = useState('events');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [e, epic] = await Promise.all([
                getEONETEvents(50),
                getEPICImages(),
            ]);
            setEvents(e); setEpicImages(epic);
            setLoading(false);
        }
        load();
    }, []);

    const categories = events ? [...new Set(events.map(e => e.category))] : [];
    const filteredEvents = events ? (selectedCategory === 'all' ? events : events.filter(e => e.category === selectedCategory)) : [];

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>🌍 Earth Insights</h1>
                <p>How satellites affect everyday life — climate, disasters, and environmental monitoring</p>
            </div>

            <div className="section-tabs">
                {['events', 'earth-images', 'impact'].map(tab => (
                    <button key={tab} className={`section-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab === 'events' ? '🌍 Natural Events' : tab === 'earth-images' ? '📸 Earth from Space' : '🔗 Real-World Impact'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid-auto">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: 200 }}></div>)}</div>
            ) : (
                <>
                    {activeTab === 'events' && (
                        <div>
                            {/* Category filters */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                                <button
                                    className={`section-tab ${selectedCategory === 'all' ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory('all')}
                                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                >
                                    All ({events?.length || 0})
                                </button>
                                {categories.map(c => (
                                    <button
                                        key={c}
                                        className={`section-tab ${selectedCategory === c ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(c)}
                                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                    >
                                        {categoryIcons[c] || '🌍'} {c} ({events?.filter(e => e.category === c).length})
                                    </button>
                                ))}
                            </div>

                            <div className="grid-auto">
                                {filteredEvents.length > 0 ? filteredEvents.map((e, i) => (
                                    <div key={e.id || i} className="glass-card animate-in">
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
                                                background: categoryColors[e.category] || 'rgba(123,97,255,0.15)'
                                            }}>
                                                {categoryIcons[e.category] || '🌍'}
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{e.title}</h3>
                                                <span className="tag">{e.category}</span>
                                            </div>
                                        </div>
                                        {e.geometry?.[0] && (
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                                                📅 {new Date(e.geometry[0].date).toLocaleDateString()} &nbsp;
                                                📍 {e.geometry[0].coordinates?.[1]?.toFixed(2)}°, {e.geometry[0].coordinates?.[0]?.toFixed(2)}°
                                            </div>
                                        )}
                                        {e.sources?.length > 0 && (
                                            <a href={e.sources[0].url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem' }}>
                                                View Source →
                                            </a>
                                        )}
                                        <div style={{ marginTop: 12, padding: 10, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', borderLeft: '3px solid var(--accent-cyan)' }}>
                                            <strong style={{ color: 'var(--accent-cyan)' }}>What this means for people:</strong>
                                            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                                                {e.category === 'Wildfires' && 'Wildfires affect air quality, displace communities, and destroy ecosystems. Satellite monitoring enables early detection and faster evacuation.'}
                                                {e.category === 'Severe Storms' && 'Severe storms endanger lives and infrastructure. Satellite tracking provides critical early warnings to vulnerable regions.'}
                                                {e.category === 'Volcanoes' && 'Volcanic activity affects aviation routes and air quality. Satellite monitoring helps track ash clouds and alert airlines.'}
                                                {e.category === 'Floods' && 'Floods damage homes, crops, and infrastructure. Satellite imagery maps affected areas for relief teams.'}
                                                {!['Wildfires', 'Severe Storms', 'Volcanoes', 'Floods'].includes(e.category) && 'Satellite monitoring of natural events helps communities prepare, respond, and recover from environmental challenges.'}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="empty-state"><div className="empty-icon">🌍</div><h3>No events in this category</h3></div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'earth-images' && (
                        <div>
                            <div className="glass-card" style={{ marginBottom: 20 }}>
                                <div className="card-header">
                                    <div className="card-title"><IoImage className="card-icon" /> Earth from DSCOVR (EPIC Camera)</div>
                                    <span className="tag">NASA EPIC</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                                    These images are captured daily by the DSCOVR satellite positioned 1.5 million km from Earth at the L1 Lagrange point.
                                </p>
                            </div>
                            <div className="grid-auto">
                                {epicImages?.length > 0 ? epicImages.map((img, i) => (
                                    <div key={img.identifier || i} className="glass-card animate-in">
                                        <img
                                            src={img.imageUrl} alt={img.caption || 'Earth from space'}
                                            style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 12 }}
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                                            {img.caption}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            📅 {new Date(img.date).toLocaleString()}
                                        </p>
                                    </div>
                                )) : <div className="empty-state"><div className="empty-icon">📸</div><h3>EPIC images unavailable</h3></div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'impact' && (
                        <div className="grid-auto">
                            {[
                                { icon: '🌡️', title: 'Climate Monitoring', desc: 'Satellites measure global temperature anomalies, greenhouse gas concentrations, and sea level rise. This data drives climate policy and scientific research.', impact: 'Helps predict and mitigate climate change effects worldwide.' },
                                { icon: '🌾', title: 'Agriculture & Food Security', desc: 'Satellite NDVI data monitors crop health, soil moisture, and drought conditions. Farmers in India, Africa, and beyond use this data for planning.', impact: 'Enables precision farming, drought alerts, and crop yield predictions.' },
                                { icon: '🌊', title: 'Disaster Response', desc: 'During floods, cyclones, and earthquakes, satellites provide rapid damage assessment. Relief agencies use this imagery to prioritize rescue operations.', impact: 'Saves lives by enabling faster, better-coordinated disaster response.' },
                                { icon: '🧊', title: 'Glacier & Ice Monitoring', desc: 'Satellites track glacier retreat, polar ice coverage, and iceberg calving. These measurements are critical indicators of global warming.', impact: 'Informs sea level rise predictions that affect coastal communities.' },
                                { icon: '🌲', title: 'Forest & Biodiversity', desc: 'Deforestation satellite monitoring detects illegal logging in real-time. This data protects carbon sinks and wildlife habitats.', impact: 'Protects ecosystems and helps enforce environmental regulations.' },
                                { icon: '🏙️', title: 'Urban Planning', desc: 'High-resolution satellite imagery helps city planners track urban sprawl, heat islands, and infrastructure development.', impact: 'Creates more sustainable, livable cities through data-driven planning.' },
                            ].map((item, i) => (
                                <div key={i} className="glass-card animate-in">
                                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{item.icon}</div>
                                    <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{item.desc}</p>
                                    <div style={{ padding: 10, background: 'rgba(6,214,160,0.05)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-cyan)' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}><strong>Impact:</strong> {item.impact}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
