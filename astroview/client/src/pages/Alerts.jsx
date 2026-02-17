import { useState } from 'react';
import { IoNotifications, IoCheckmarkCircle, IoTime, IoTrash, IoAdd } from 'react-icons/io5';

const defaultAlerts = [
    { id: 1, type: 'sky-event', title: 'Perseid Meteor Shower Peak', body: 'Peak viewing tonight between midnight and dawn. Up to 100 meteors/hour expected.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: false, category: 'astronomy' },
    { id: 2, type: 'space-weather', title: 'Minor Geomagnetic Storm Watch', body: 'Kp index expected to reach 4. Aurora may be visible at higher latitudes tonight.', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), read: true, category: 'space-weather' },
    { id: 3, type: 'launch', title: 'SpaceX Falcon 9 Launch Tomorrow', body: 'Starlink Group 7-9 launch scheduled for 2:30 AM UTC from Cape Canaveral.', timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), read: true, category: 'missions' },
    { id: 4, type: 'earth-event', title: 'Severe Storm Detected — Bay of Bengal', body: 'EONET tracking: Cyclone forming in Bay of Bengal. Satellite monitoring active.', timestamp: new Date(Date.now() - 5 * 86400000).toISOString(), read: true, category: 'climate' },
    { id: 5, type: 'sky-event', title: 'ISS Visible Tonight', body: 'The ISS will pass over your location at 8:42 PM, visible for 4 minutes. Look NW to SE.', timestamp: new Date(Date.now() - 7 * 86400000).toISOString(), read: true, category: 'astronomy' },
];

const alertIcons = {
    'sky-event': '🌠',
    'space-weather': '☀️',
    'launch': '🚀',
    'earth-event': '🌍',
};

export default function Alerts() {
    const [alerts, setAlerts] = useState(defaultAlerts);
    const [filter, setFilter] = useState('all');
    const [settings, setSettings] = useState({
        skyEvents: true,
        spaceWeather: true,
        launches: true,
        earthEvents: true,
        quietStart: '22:00',
        quietEnd: '07:00',
    });

    const markRead = (id) => setAlerts(a => a.map(al => al.id === id ? { ...al, read: true } : al));
    const deleteAlert = (id) => setAlerts(a => a.filter(al => al.id !== id));
    const markAllRead = () => setAlerts(a => a.map(al => ({ ...al, read: true })));

    const filtered = filter === 'all' ? alerts : filter === 'unread' ? alerts.filter(a => !a.read) : alerts.filter(a => a.category === filter);
    const unreadCount = alerts.filter(a => !a.read).length;

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>🔔 Alerts & Notifications</h1>
                <p>Stay updated — customize what you want to know about</p>
            </div>

            <div className="grid-3" style={{ marginBottom: 24 }}>
                {/* Alert settings */}
                <div className="glass-card animate-in stagger-1">
                    <div className="card-header">
                        <div className="card-title">⚙️ Alert Preferences</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { key: 'skyEvents', label: '🌠 Sky Events', desc: 'Meteor showers, ISS passes, eclipses' },
                            { key: 'spaceWeather', label: '☀️ Space Weather', desc: 'Solar flares, geomagnetic storms' },
                            { key: 'launches', label: '🚀 Launches', desc: 'Upcoming rocket launches' },
                            { key: 'earthEvents', label: '🌍 Earth Events', desc: 'Cyclones, wildfires, floods' },
                        ].map(s => (
                            <label key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '8px 0' }}>
                                <input
                                    type="checkbox" checked={settings[s.key]} onChange={e => setSettings({ ...settings, [s.key]: e.target.checked })}
                                    style={{ width: 18, height: 18, accentColor: 'var(--accent-cyan)' }}
                                />
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{s.label}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 8 }}>🌙 Quiet Hours</p>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.82rem' }}>
                            <input type="time" value={settings.quietStart} onChange={e => setSettings({ ...settings, quietStart: e.target.value })} style={{ background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }} />
                            <span style={{ color: 'var(--text-muted)' }}>to</span>
                            <input type="time" value={settings.quietEnd} onChange={e => setSettings({ ...settings, quietEnd: e.target.value })} style={{ background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }} />
                        </div>
                    </div>
                </div>

                {/* Alert Feed */}
                <div className="glass-card animate-in stagger-2" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <div className="card-title">
                            <IoNotifications className="card-icon" />
                            Alert History
                            {unreadCount > 0 && <span className="status-badge danger" style={{ marginLeft: 8 }}>{unreadCount} new</span>}
                        </div>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-primary)' }}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                        {['all', 'unread', 'astronomy', 'space-weather', 'missions', 'climate'].map(f => (
                            <button key={f} className={`section-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                                {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 500, overflowY: 'auto' }}>
                        {filtered.length > 0 ? filtered.map(a => (
                            <div key={a.id} style={{ display: 'flex', gap: 12, padding: 12, background: a.read ? 'var(--bg-glass)' : 'rgba(6,214,160,0.05)', borderRadius: 'var(--radius-sm)', borderLeft: a.read ? 'none' : '3px solid var(--accent-cyan)', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.3rem', marginTop: 2 }}>{alertIcons[a.type] || '🔔'}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: a.read ? 400 : 600, fontSize: '0.88rem', marginBottom: 2 }}>{a.title}</div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{a.body}</p>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}><IoTime style={{ verticalAlign: 'middle' }} /> {new Date(a.timestamp).toLocaleDateString()}</span>
                                        <span className="tag">{a.category}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {!a.read && (
                                        <button onClick={() => markRead(a.id)} title="Mark read" style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: 4 }}>
                                            <IoCheckmarkCircle size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => deleteAlert(a.id)} title="Delete" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                                        <IoTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="empty-state"><div className="empty-icon">✅</div><h3>No alerts</h3></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
