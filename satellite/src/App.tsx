import { useState, useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import VisualizerContainer from './components/visualization/VisualizerContainer';
import LunarTable from './components/events/LunarTable';
import MeteorCalendar from './components/events/MeteorCalendar';
import InfoPanel from './components/layout/InfoPanel';
import { useSatelliteGroup } from './hooks/useSatelliteGroup';
import { SATELLITE_GROUPS } from './data/satellites';
import './App.css';

function App() {
    const { positions, getPath } = useSatelliteGroup(SATELLITE_GROUPS);
    const [selectedSatId, setSelectedSatId] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                (err) => {
                    console.error("Error getting location:", err);
                    // Default to Null Island or somewhere visible if needed, but keeping null allows transparency that it's waiting/failed
                }
            );
        }
    }, []);

    const selectedSatData = selectedSatId
        ? positions.find(p => p.id === selectedSatId)
        : null;

    const selectedSatStatic = selectedSatId
        ? SATELLITE_GROUPS.find(s => s.id === selectedSatId)
        : null;

    return (
        <MainLayout
            visualizer={
                <VisualizerContainer
                    positions={positions}
                    selectedSatId={selectedSatId}
                    onSatelliteSelect={setSelectedSatId}
                    getPath={getPath}
                />
            }
            infoPanel={
                <InfoPanel>
                    <div style={{ paddingBottom: '20px' }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#00dcb4' }}>
                            Satellite Tracker
                        </h1>

                        {selectedSatData && selectedSatStatic ? (
                            <div className="satellite-details card" style={{ borderColor: '#00dcb4' }}>
                                <h2 style={{ color: '#00dcb4', fontSize: '1.2rem' }}>{selectedSatStatic.name}</h2>
                                <div className="data-row">
                                    <span>Group:</span> <span style={{ color: '#fff' }}>{selectedSatData.group}</span>
                                </div>
                                <div className="data-row">
                                    <span>Latitude:</span> <span style={{ color: '#fff' }}>{selectedSatData.lat.toFixed(4)}°</span>
                                </div>
                                <div className="data-row">
                                    <span>Longitude:</span> <span style={{ color: '#fff' }}>{selectedSatData.lng.toFixed(4)}°</span>
                                </div>
                                <div className="data-row">
                                    <span>Altitude:</span> <span style={{ color: '#fff' }}>{selectedSatData.alt.toFixed(1)} km</span>
                                </div>
                                <div className="data-row">
                                    <span>Velocity:</span> <span style={{ color: '#fff' }}>{selectedSatData.velocity.toFixed(1)} km/s</span>
                                </div>
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                Select a satellite from the view to see details.
                                <br /><br />
                                Tracking <strong>{positions.length}</strong> active satellites.
                            </p>
                        )}
                    </div>
                    <LunarTable location={location} />
                    <MeteorCalendar />
                </InfoPanel>
            }
        />
    );
}

export default App;
