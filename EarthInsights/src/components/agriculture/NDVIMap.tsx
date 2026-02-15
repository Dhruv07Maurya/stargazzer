
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { useNDVIData } from '../../hooks/useNDVIData';
import 'leaflet/dist/leaflet.css';

const NDVIMap = () => {
    const { data, loading } = useNDVIData();

    const getColor = (health: number) => {
        if (health > 0.7) return '#15803d'; // Green-700 (Lush)
        if (health > 0.5) return '#4ade80'; // Green-400 (Healthy)
        if (health > 0.3) return '#facc15'; // Yellow-400 (Moderate Stress)
        return '#ef4444'; // Red-500 (Severe Stress)
    };

    if (loading) return <div className="h-full w-full flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-xl">Loading Vegetation Index...</div>;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-neutral-800 relative z-0">
            <div className="absolute top-4 right-4 z-[400] bg-neutral-900/80 backdrop-blur border border-neutral-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-xs font-medium text-white">
                    DEMO MODE (Simulated)
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

                {data.map((region) => (
                    <Circle
                        key={region.id}
                        center={[region.lat, region.lng]}
                        pathOptions={{
                            color: 'transparent',
                            fillColor: getColor(region.health),
                            fillOpacity: 0.5,
                        }}
                        radius={region.radius * 1000}
                    >
                        <Popup>
                            <div className="bg-neutral-900 text-black p-1">
                                <div className="font-bold">{region.cropType}</div>
                                <div className="text-xs">NDVI: {region.health.toFixed(2)}</div>
                                <div className="text-xs">
                                    Status: {region.health > 0.5 ? 'Healthy' : region.health > 0.3 ? 'Stressed' : 'Critical'}
                                </div>
                            </div>
                        </Popup>
                    </Circle>
                ))}
            </MapContainer>
        </div>
    );
};

export default NDVIMap;
