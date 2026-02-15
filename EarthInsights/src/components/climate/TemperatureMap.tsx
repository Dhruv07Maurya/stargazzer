import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTemperatureData } from '../../hooks/useTemperatureData';

const TemperatureMap = () => {
    const { data, loading, source, location } = useTemperatureData();

    // Calculate latest anomaly for the marker
    const latestAnomaly = data.length > 0 ? data[data.length - 1].anomaly : 0;

    // Create a list of spots to display. 
    // If we have real location, use it. Otherwise (loading/init), empty? 
    // Or if source is SIMULATED, maybe the hook should have returned the list of hotspots?
    // Given the hook returns a timeseries for a SINGLE location, we visualize that single location.
    const spots = location ? [{
        lat: location.lat,
        lng: location.lon,
        anomaly: latestAnomaly,
        location: source === 'REAL' ? 'Your Location' : 'Mumbai (Default)'
    }] : [];

    const getColor = (anomaly: number) => {
        return anomaly > 2.0 ? '#7f1d1d' : // Dark Red
            anomaly > 1.5 ? '#b91c1c' : // Red
                anomaly > 1.0 ? '#ef4444' : // Light Red
                    '#fbbf24';  // Yellow/Orange
    };

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-neutral-800 relative z-0">
            {/* Live/Demo Badge */}
            <div className="absolute top-4 right-4 z-[400] bg-neutral-900/80 backdrop-blur border border-neutral-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${source === 'REAL' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <span className="text-xs font-medium text-white">
                    {source === 'REAL' ? 'LIVE DATA (NASA)' : 'DEMO MODE'}
                </span>
            </div>

            <MapContainer
                center={[20, 0]}
                zoom={2}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {spots.map((spot, idx) => (
                    <CircleMarker
                        key={idx}
                        center={[spot.lat, spot.lng]}
                        pathOptions={{
                            color: getColor(spot.anomaly),
                            fillColor: getColor(spot.anomaly),
                            fillOpacity: 0.6,
                            weight: 1
                        }}
                        radius={10 + Math.abs(spot.anomaly) * 5}
                    >
                        <Popup>
                            <div className="bg-neutral-900 text-black p-1">
                                <div className="text-sm font-semibold">{spot.location}</div>
                                <div className="text-xs">Anomaly: {spot.anomaly > 0 ? '+' : ''}{spot.anomaly}°C</div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export default TemperatureMap;
