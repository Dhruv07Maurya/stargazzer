import { useState, useEffect } from 'react';
import { IoSettings, IoLocation, IoMoon, IoSunny, IoGlobe, IoSchool, IoSpeedometer, IoStar } from 'react-icons/io5';

export default function Preferences() {
    const [prefs, setPrefs] = useState({
        location: { lat: '', lng: '', city: '' },
        autoLocation: true,
        interests: ['astronomy', 'missions', 'space-weather'],
        difficulty: 'intermediate',
        units: 'metric',
        darkMode: true,
        language: 'en',
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('astroview_prefs');
        if (stored) setPrefs(JSON.parse(stored));

        if (prefs.autoLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                p => setPrefs(prev => ({ ...prev, location: { ...prev.location, lat: p.coords.latitude.toFixed(4), lng: p.coords.longitude.toFixed(4) } })),
                () => { }
            );
        }
    }, []);

    const save = () => {
        localStorage.setItem('astroview_prefs', JSON.stringify(prefs));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const toggleInterest = (interest) => {
        setPrefs(p => ({
            ...p,
            interests: p.interests.includes(interest) ? p.interests.filter(i => i !== interest) : [...p.interests, interest],
        }));
    };

    const allInterests = [
        { id: 'astronomy', label: '🌠 Astronomy & Sky Events' },
        { id: 'missions', label: '🚀 Missions & Launches' },
        { id: 'space-weather', label: '☀️ Space Weather' },
        { id: 'climate', label: '🌡️ Climate Monitoring' },
        { id: 'agriculture', label: '🌾 Agriculture' },
        { id: 'disasters', label: '🌊 Disaster Monitoring' },
        { id: 'education', label: '📚 Education & Learning' },
    ];

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>⚙️ Preferences</h1>
                <p>Personalize your AstroView experience</p>
            </div>

            <div className="grid-2">
                {/* Location */}
                <div className="glass-card animate-in stagger-1">
                    <div className="card-header">
                        <div className="card-title"><IoLocation className="card-icon" /> Location</div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, cursor: 'pointer' }}>
                        <input type="checkbox" checked={prefs.autoLocation} onChange={e => setPrefs({ ...prefs, autoLocation: e.target.checked })} style={{ width: 18, height: 18, accentColor: 'var(--accent-cyan)' }} />
                        <span style={{ fontSize: '0.85rem' }}>Use GPS location automatically</span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Latitude</label>
                            <input type="number" step="0.0001" value={prefs.location.lat} onChange={e => setPrefs({ ...prefs, location: { ...prefs.location, lat: e.target.value } })}
                                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }}
                                disabled={prefs.autoLocation}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Longitude</label>
                            <input type="number" step="0.0001" value={prefs.location.lng} onChange={e => setPrefs({ ...prefs, location: { ...prefs.location, lng: e.target.value } })}
                                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }}
                                disabled={prefs.autoLocation}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>City (optional)</label>
                        <input type="text" value={prefs.location.city} onChange={e => setPrefs({ ...prefs, location: { ...prefs.location, city: e.target.value } })} placeholder="e.g., New Delhi"
                            style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }}
                        />
                    </div>
                </div>

                {/* Interests */}
                <div className="glass-card animate-in stagger-2">
                    <div className="card-header">
                        <div className="card-title"><IoStar className="card-icon" /> Interests</div>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>Select topics you're interested in:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {allInterests.map(i => (
                            <label key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '8px 12px', background: prefs.interests.includes(i.id) ? 'rgba(6,214,160,0.08)' : 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: prefs.interests.includes(i.id) ? '1px solid var(--border-accent)' : '1px solid transparent', transition: 'all var(--transition-fast)' }}>
                                <input type="checkbox" checked={prefs.interests.includes(i.id)} onChange={() => toggleInterest(i.id)} style={{ width: 18, height: 18, accentColor: 'var(--accent-cyan)' }} />
                                <span style={{ fontSize: '0.85rem' }}>{i.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Learning Level */}
                <div className="glass-card animate-in stagger-3">
                    <div className="card-header">
                        <div className="card-title"><IoSchool className="card-icon" /> Learning Level</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                            { id: 'beginner', label: '🌱 Beginner', desc: 'Simple explanations, less technical data' },
                            { id: 'intermediate', label: '📊 Intermediate', desc: 'Balanced detail, charts and context' },
                            { id: 'advanced', label: '🔬 Advanced', desc: 'Full data, raw metrics, technical details' },
                        ].map(l => (
                            <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '12px', background: prefs.difficulty === l.id ? 'rgba(6,214,160,0.08)' : 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: prefs.difficulty === l.id ? '1px solid var(--border-accent)' : '1px solid transparent' }}>
                                <input type="radio" name="difficulty" checked={prefs.difficulty === l.id} onChange={() => setPrefs({ ...prefs, difficulty: l.id })} style={{ accentColor: 'var(--accent-cyan)' }} />
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{l.label}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{l.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Display Settings */}
                <div className="glass-card animate-in stagger-4">
                    <div className="card-header">
                        <div className="card-title"><IoSettings className="card-icon" /> Display</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Units</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {['metric', 'imperial'].map(u => (
                                    <button key={u} onClick={() => setPrefs({ ...prefs, units: u })}
                                        style={{ padding: '8px 20px', background: prefs.units === u ? 'rgba(6,214,160,0.12)' : 'var(--bg-glass)', border: prefs.units === u ? '1px solid var(--border-accent)' : '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-sm)', color: prefs.units === u ? 'var(--accent-cyan)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-primary)', fontSize: '0.82rem' }}
                                    >
                                        {u === 'metric' ? '🌡️ Metric (°C, km)' : '🌡️ Imperial (°F, mi)'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <IoMoon style={{ color: 'var(--accent-purple)' }} />
                                <span style={{ fontSize: '0.85rem' }}>Dark Mode</span>
                            </div>
                            <input type="checkbox" checked={prefs.darkMode} onChange={e => setPrefs({ ...prefs, darkMode: e.target.checked })} style={{ width: 18, height: 18, accentColor: 'var(--accent-cyan)' }} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Save button */}
            <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
                <button onClick={save} style={{ padding: '12px 32px', background: 'var(--accent-cyan)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-primary)', fontSize: '0.9rem', transition: 'all var(--transition-fast)' }}>
                    Save Preferences
                </button>
                {saved && <span style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>✓ Preferences saved!</span>}
            </div>
        </div>
    );
}
