
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import { useRainfallData } from '../../hooks/useRainfallData';
import 'leaflet/dist/leaflet.css';

const RainfallMap = () => {
    const { regions, loading, source } = useRainfallData();

    if (loading) return <div className="h-full w-full flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-xl">Loading Radar Data...</div>;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-neutral-800 relative z-0">
            <div className="absolute top-4 right-4 z-[400] bg-neutral-900/80 backdrop-blur border border-neutral-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${source === 'REAL' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <span className="text-xs font-medium text-white">
                    {source === 'REAL' ? 'LIVE DATA (NASA POWER)' : 'DEMO MODE'}
                </span>
            </div>

            <MapContainer
                center={[20, 0]}
                zoom={2}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {regions.map((region) => (
                    <Circle
                        key={region.id}
                        center={[region.lat, region.lng]}
                        pathOptions={{
                            color: 'transparent',
                            fillColor: '#3b82f6', // Blue
                            fillOpacity: region.intensity / 100 * 0.6,
                        }}
                        radius={region.radius * 1000} // Convert km to meters
                    />
                ))}
            </MapContainer>
        </div>
    );
};

export default RainfallMap;
