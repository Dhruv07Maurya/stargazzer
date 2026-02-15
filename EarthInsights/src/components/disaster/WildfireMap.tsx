
import { MapContainer, TileLayer, CircleMarker as LeafletCircleMarker, Popup } from 'react-leaflet';
import { useWildfireData } from '../../hooks/useWildfireData';
import 'leaflet/dist/leaflet.css';

// Fix for missing radius in CircleMarkerProps type definition
// @ts-ignore
const CircleMarker = LeafletCircleMarker as any;

const WildfireMap = () => {
    const { data, loading, error, source } = useWildfireData();

    if (loading) return <div className="h-full w-full flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-xl">Loading Fire Data...</div>;
    if (error) return <div className="h-full w-full flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-xl text-red-500">{error}</div>;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-neutral-800 relative z-0">
            <MapContainer
                center={[0, 0]}
                zoom={2}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <div className="absolute top-4 right-4 z-[400] bg-neutral-900/80 backdrop-blur border border-neutral-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${source === 'REAL' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs font-medium text-white">
                        {source === 'REAL' ? 'LIVE DATA (NASA EONET)' : 'DEMO MODE'}
                    </span>
                </div>

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {data.map((fire) => (
                    <CircleMarker
                        key={fire.id}
                        center={[fire.lat, fire.lng]}
                        pathOptions={{
                            color: '#d97706', // Amber-600 ring
                            fillColor: fire.brightness > 340 ? '#ef4444' : '#f59e0b', // Red if very hot, else orange
                            fillOpacity: 0.8,
                            weight: 1
                        }}
                        radius={fire.brightness > 330 ? 6 : 4}
                    >
                        <Popup className="bg-neutral-900 text-black">
                            <div className="font-bold">Active Fire</div>
                            <div className="text-xs">Location: {fire.lat.toFixed(2)}, {fire.lng.toFixed(2)}</div>
                            <div className="text-xs">Brightness: {fire.brightness.toFixed(0)}K</div>
                            <div className="text-xs">Confidence: {fire.confidence}</div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export default WildfireMap;
