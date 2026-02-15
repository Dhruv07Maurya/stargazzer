import { useState, useEffect } from 'react';
import { IoSchool, IoBook, IoHelpCircle, IoCheckmarkCircle, IoCloseCircle, IoChevronForward, IoSearch, IoDownload } from 'react-icons/io5';
import { searchNASAImages, getAPODArchive } from '../services/api';
import glossary from '../data/glossary';
import quizzes from '../data/quizzes';

function QuizSection() {
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const handleAnswer = (idx) => {
        if (selected !== null) return;
        setSelected(idx);
        if (idx === selectedQuiz.questions[currentQ].answer) setScore(s => s + 1);
    };

    const nextQuestion = () => {
        if (currentQ + 1 >= selectedQuiz.questions.length) {
            setFinished(true);
        } else {
            setCurrentQ(c => c + 1);
            setSelected(null);
        }
    };

    const resetQuiz = () => {
        setSelectedQuiz(null); setCurrentQ(0); setSelected(null); setScore(0); setFinished(false);
    };

    if (!selectedQuiz) {
        return (
            <div className="grid-auto">
                {quizzes.map(q => (
                    <div key={q.id} className="glass-card animate-in" style={{ cursor: 'pointer' }} onClick={() => setSelectedQuiz(q)}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🧠</div>
                        <h3 style={{ marginBottom: 4 }}>{q.title}</h3>
                        <span className={`status-badge ${q.difficulty === 'Beginner' ? 'success' : q.difficulty === 'Intermediate' ? 'info' : 'warning'}`}>
                            {q.difficulty}
                        </span>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 8 }}>
                            {q.questions.length} questions
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    if (finished) {
        return (
            <div className="glass-card animate-in" style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>{score === selectedQuiz.questions.length ? '🏆' : score > selectedQuiz.questions.length / 2 ? '⭐' : '📚'}</div>
                <h2 style={{ marginBottom: 8 }}>Quiz Complete!</h2>
                <div className="metric-value" style={{ fontSize: '2.5rem' }}>{score}/{selectedQuiz.questions.length}</div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24, marginTop: 8 }}>
                    {score === selectedQuiz.questions.length ? 'Perfect score! You\'re a space expert! 🚀' : score > selectedQuiz.questions.length / 2 ? 'Great job! Keep exploring! 🌟' : 'Keep learning — space has so much to discover! 🔭'}
                </p>
                <button onClick={resetQuiz} style={{ padding: '12px 24px', background: 'var(--accent-cyan)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-primary)' }}>
                    Try Another Quiz
                </button>
            </div>
        );
    }

    const q = selectedQuiz.questions[currentQ];

    return (
        <div className="glass-card animate-in">
            <div className="flex-between" style={{ marginBottom: 16 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedQuiz.title}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>Q{currentQ + 1} / {selectedQuiz.questions.length}</span>
            </div>
            <div className="gauge-bar" style={{ marginBottom: 24 }}>
                <div className="gauge-fill low" style={{ width: `${((currentQ + 1) / selectedQuiz.questions.length) * 100}%` }}></div>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, lineHeight: 1.5 }}>{q.q}</h3>
            <div>
                {q.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`quiz-option ${selected !== null ? (idx === q.answer ? 'correct' : idx === selected ? 'wrong' : '') : ''}`}
                    >
                        {selected !== null && idx === q.answer && <IoCheckmarkCircle style={{ color: 'var(--accent-cyan)', marginRight: 8, verticalAlign: 'middle' }} />}
                        {selected !== null && idx === selected && idx !== q.answer && <IoCloseCircle style={{ color: 'var(--accent-red)', marginRight: 8, verticalAlign: 'middle' }} />}
                        {opt}
                    </button>
                ))}
            </div>
            {selected !== null && (
                <div style={{ marginTop: 16 }}>
                    <div style={{ background: 'rgba(6,214,160,0.05)', padding: 12, borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-cyan)', marginBottom: 16 }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{q.explanation}</p>
                    </div>
                    <button onClick={nextQuestion} style={{ padding: '10px 20px', background: 'var(--accent-cyan)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {currentQ + 1 >= selectedQuiz.questions.length ? 'See Results' : 'Next Question'} <IoChevronForward />
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Learn() {
    const [activeTab, setActiveTab] = useState('guides');
    const [searchQuery, setSearchQuery] = useState('');
    const [nasaImages, setNasaImages] = useState(null);
    const [apodArchive, setApodArchive] = useState(null);
    const [glossaryFilter, setGlossaryFilter] = useState('');

    useEffect(() => {
        getAPODArchive().then(setApodArchive);
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        const data = await searchNASAImages(searchQuery);
        setNasaImages(data);
    };

    const guides = [
        { icon: '🛰️', title: 'What is a Satellite?', content: 'A satellite is any object that orbits around another object in space. The Moon is Earth\'s natural satellite. Artificial satellites are machines we\'ve launched into space for communication, weather monitoring, GPS navigation, and scientific research. There are over 7,000 active satellites orbiting Earth right now!' },
        { icon: '🌍', title: 'What is an Orbit?', content: 'An orbit is the curved path an object takes around another due to gravity. Earth orbits the Sun, taking 365.25 days to complete one loop. Satellites orbit Earth at various heights — the ISS at ~400 km (takes 90 minutes), GPS satellites at ~20,200 km, and geostationary ones at ~36,000 km.' },
        { icon: '☀️', title: 'What is Space Weather?', content: 'Space weather refers to conditions in space caused by solar activity. The Sun constantly releases particles (solar wind) and occasionally has violent eruptions (solar flares, CMEs). These can affect Earth\'s magnetic field, causing auroras but also disrupting GPS, radio, and power grids.' },
        { icon: '🔭', title: 'How to Start Stargazing', content: 'Start with your naked eyes! Find a dark location away from city lights. Wait 20 minutes for your eyes to adjust. Learn the major constellations — Orion, the Big Dipper, and Cassiopeia are great starters. Use a stargazing app to identify what you see. Binoculars can reveal Jupiter\'s moons and star clusters!' },
        { icon: '🚀', title: 'How Do Rockets Work?', content: 'Rockets work on Newton\'s Third Law — every action has an equal and opposite reaction. By pushing hot gases out of the bottom at high speed, the rocket is pushed upward. To reach orbit (~400 km for ISS), a rocket must reach ~28,000 km/h. Modern rockets like Falcon 9 can land and be reused!' },
        { icon: '📡', title: 'How Satellites Help Us Daily', content: 'Satellites are invisible helpers in your daily life. GPS uses 31+ satellites for navigation. Weather satellites provide forecasts. Communication satellites carry TV, internet, and phone signals. Earth observation satellites monitor crops, track disasters, and study climate change. Even ATM transactions use satellite timing!' },
    ];

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>📚 Learn</h1>
                <p>Understand space deeply — guides, quizzes, glossary, and classroom resources</p>
            </div>

            <div className="section-tabs">
                {['guides', 'quiz', 'glossary', 'explore-nasa', 'gallery'].map(tab => (
                    <button key={tab} className={`section-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab === 'guides' ? '📖 Guides' : tab === 'quiz' ? '🧠 Quizzes' : tab === 'glossary' ? '📝 Glossary' : tab === 'explore-nasa' ? '🔍 NASA Library' : '🌅 Gallery'}
                    </button>
                ))}
            </div>

            {activeTab === 'guides' && (
                <div className="grid-auto">
                    {guides.map((g, i) => (
                        <div key={i} className="glass-card animate-in">
                            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{g.icon}</div>
                            <h3 style={{ fontSize: '1.05rem', marginBottom: 12 }}>{g.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{g.content}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'quiz' && <QuizSection />}

            {activeTab === 'glossary' && (
                <div>
                    <div style={{ marginBottom: 20 }}>
                        <input
                            type="text" value={glossaryFilter} onChange={e => setGlossaryFilter(e.target.value)}
                            placeholder="Search terms..."
                            style={{ width: '100%', maxWidth: 400, padding: '10px 16px', background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-primary)', fontSize: '0.9rem' }}
                        />
                    </div>
                    <div className="grid-auto">
                        {glossary.filter(g => g.term.toLowerCase().includes(glossaryFilter.toLowerCase()) || g.definition.toLowerCase().includes(glossaryFilter.toLowerCase())).map((g, i) => (
                            <div key={i} className="glass-card animate-in">
                                <h3 style={{ fontSize: '1rem', color: 'var(--accent-cyan)', marginBottom: 8 }}>{g.term}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{g.definition}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'explore-nasa' && (
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        <input
                            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            placeholder="Search NASA images (e.g., Mars, Nebula, ISS)..."
                            style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-primary)', fontSize: '0.9rem' }}
                        />
                        <button onClick={handleSearch} style={{ padding: '10px 20px', background: 'var(--accent-cyan)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <IoSearch /> Search
                        </button>
                    </div>
                    {nasaImages && (
                        <div className="grid-auto">
                            {nasaImages.map((img, i) => (
                                <div key={img.nasaId || i} className="glass-card animate-in">
                                    {img.thumbnail && (
                                        <img src={img.thumbnail} alt={img.title} style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 12, maxHeight: 200, objectFit: 'cover' }} />
                                    )}
                                    <h3 style={{ fontSize: '0.9rem', marginBottom: 4 }}>{img.title}</h3>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>{new Date(img.date).toLocaleDateString()}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{img.description?.slice(0, 150)}{img.description?.length > 150 ? '...' : ''}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {!nasaImages && (
                        <div className="empty-state"><div className="empty-icon">🔍</div><h3>Search NASA's image library</h3><p>Try searching for "nebula", "mars rover", or "earth from space"</p></div>
                    )}
                </div>
            )}

            {activeTab === 'gallery' && (
                <div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Random picks from NASA's Astronomy Picture of the Day archive:</p>
                    <div className="grid-auto">
                        {apodArchive?.length > 0 ? apodArchive.map((a, i) => (
                            <div key={i} className="glass-card animate-in">
                                {a.media_type === 'image' && (
                                    <img src={a.url} alt={a.title} style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 12, maxHeight: 220, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                )}
                                <h3 style={{ fontSize: '0.9rem', marginBottom: 4 }}>{a.title}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{a.date}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.explanation?.slice(0, 120)}...</p>
                            </div>
                        )) : <div className="empty-state"><div className="empty-icon">🌅</div><h3>Gallery loading...</h3></div>}
                    </div>
                </div>
            )}
        </div>
    );
}
