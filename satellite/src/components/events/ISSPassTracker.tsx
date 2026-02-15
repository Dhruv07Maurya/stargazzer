import { useState, useEffect } from 'react';
import { fetchTLE, propagateSatellite, predictVisiblePasses, SatelliteInfo, PassPrediction } from '../../services/satelliteService';

const ISSPassTracker = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [satelliteInfo, setSatelliteInfo] = useState<SatelliteInfo | null>(null);
    const [passes, setPasses] = useState<PassPrediction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tle, setTle] = useState<{ line1: string; line2: string } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                () => {
                    setError('Location access denied. Using default (0,0).');
                    setLocation({ lat: 0, lng: 0 }); // Fallback
                }
            );
        } else {
            setError('Geolocation not supported.');
        }
    }, []);

    useEffect(() => {
        const getTLE = async () => {
            try {
                const data = await fetchTLE(); // Default ISS
                setTle(data);
            } catch (err) {
                setError('Failed to load TLE data.');
                setLoading(false);
            }
        };
        getTLE();
    }, []);

    useEffect(() => {
        if (!tle) return;

        const interval = setInterval(() => {
            const now = new Date();
            // Propagate for current position
            // We don't strictly need observer location for satellite position (lat/lng/alt), 
            // but we need it for Az/El
            const info = propagateSatellite(tle.line1, tle.line2, now, location?.lat, location?.lng);
            setSatelliteInfo(info);
            setLoading(false);
        }, 1000);

        return () => clearInterval(interval);
    }, [tle, location]);

    useEffect(() => {
        if (tle && location) {
            // Calculate upcoming passes
            // This can be heavy, so maybe only run once or on demand
            const predictions = predictVisiblePasses(tle.line1, tle.line2, location.lat, location.lng);
            setPasses(predictions);
        }
    }, [tle, location]);

    if (loading && !satelliteInfo) return <div>Loading Satellite Data...</div>;

    return (
        <div className="card">
            <h2>ISS Tracker</h2>
            {error && <p className="error">{error}</p>}

            {satelliteInfo && (
                <div className="satellite-live-data">
                    <div className="data-row">
                        <span>Lat: {satelliteInfo.latitude.toFixed(4)}°</span>
                        <span>Lng: {satelliteInfo.longitude.toFixed(4)}°</span>
                        <span>Alt: {satelliteInfo.altitude.toFixed(2)} km</span>
                    </div>
                    <div className="data-row">
                        <span>Az: {satelliteInfo.azimuth ? satelliteInfo.azimuth.toFixed(1) : '-'}°</span>
                        <span>El: {satelliteInfo.elevation ? satelliteInfo.elevation.toFixed(1) : '-'}°</span>
                    </div>
                </div>
            )}

            <h3>Upcoming Visible Passes</h3>
            {passes.length === 0 ? (
                <p>No visible passes in the next 24h.</p>
            ) : (
                <table className="passes-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Duration</th>
                            <th>Max El</th>
                            <th>Direction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passes.map((pass, index) => (
                            <tr key={index}>
                                <td>{pass.riseTime.toLocaleDateString()}</td>
                                <td>{pass.riseTime.toLocaleTimeString()}</td>
                                <td>{Math.round(pass.duration)}s</td>
                                <td>{Math.round(pass.maxElevation)}°</td>
                                <td>{pass.passDirection}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ISSPassTracker;
