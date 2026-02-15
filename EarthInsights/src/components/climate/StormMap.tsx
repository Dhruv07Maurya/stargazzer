import React from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useStormData } from '../../hooks/useStormData';
import 'leaflet/dist/leaflet.css';

const StormMap = () => {
    const { data, loading, source } = useStormData();

    if (loading) return <div className="h-full w-full flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-xl">Loading Storm Tracks...</div>;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-neutral-800 relative z-0">
            {/* @ts-ignore: center prop exists in MapOptions but types are missing it */}
            <MapContainer
                center={[20, -60] as LatLngExpression}
                zoom={3}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <div className="absolute top-4 right-4 z-[400] bg-neutral-900/80 backdrop-blur border border-neutral-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${source === 'REAL' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs font-medium text-white">
                        {source === 'REAL' ? 'LIVE DATA (WEATHER.GOV)' : 'DEMO MODE'}
                    </span>
                </div>

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {data.map((storm) => (
                    <React.Fragment key={storm.id}>
                        {/* Historical Path */}
                        <Polyline
                            positions={storm.path}
                            pathOptions={{ color: '#fbbf24', weight: 3, opacity: 0.7, dashArray: '5, 5' }}
                        />
                        {/* Projected Path */}
                        <Polyline
                            positions={storm.projectedPath}
                            pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.9 }}
                        />

                        {/* Current Position Marker */}
                        <CircleMarker
                            center={storm.path[storm.path.length - 1]}
                            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1 }}
                            radius={8}
                        >
                            <Popup>
                                <div className="bg-neutral-900 text-black p-1">
                                    <div className="font-bold">{storm.name}</div>
                                    <div className="text-xs">Category {storm.category}</div>
                                    <div className="text-xs">Wind: {storm.windSpeed} km/h</div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    </React.Fragment>
                ))}
            </MapContainer>
        </div>
    );
};

export default StormMap;
