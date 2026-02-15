import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SatellitePosition, SatellitePath } from '../../hooks/useSatelliteGroup';
import { getGroupColor } from '../../data/satellites';

// Fix for default marker icon in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons based on color could be added here
const getIcon = (isSelected: boolean, color: string) => {
    // For simplicity, using default icon but could use DivIcon for custom colors
    return L.divIcon({
        className: 'custom-sat-icon',
        html: `<div style="background-color: ${color}; width: ${isSelected ? '16px' : '10px'}; height: ${isSelected ? '16px' : '10px'}; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

interface Earth2DProps {
    positions: SatellitePosition[];
    selectedSatId: string | null;
    onSatelliteClick: (id: string) => void;
    path: SatellitePath[];
}

const Earth2D = ({ positions, selectedSatId, onSatelliteClick, path }: Earth2DProps) => {

    // Convert path to leaflet format [lat, lng]
    const polylinePositions = path.map(p => [p.lat, p.lng] as [number, number]);

    // Find selected satellite position for recentering
    const selectedSat = positions.find(p => p.id === selectedSatId);

    return (
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Draw path first so markers are on top */}
            {selectedSatId && polylinePositions.length > 0 && (
                <Polyline
                    positions={polylinePositions}
                    pathOptions={{ color: '#00dcb4', weight: 2, opacity: 0.7, dashArray: '5, 10' }}
                />
            )}

            {positions.map(pos => (
                <Marker
                    key={pos.id}
                    position={[pos.lat, pos.lng]}
                    icon={getIcon(pos.id === selectedSatId, getGroupColor(pos.group))}
                    eventHandlers={{
                        click: () => onSatelliteClick(pos.id)
                    }}
                >
                    <Popup>
                        <strong>{pos.group}</strong><br />
                        Lat: {pos.lat.toFixed(2)}, Lng: {pos.lng.toFixed(2)}
                    </Popup>
                </Marker>
            ))}

            {selectedSat && <RecenterMap lat={selectedSat.lat} lng={selectedSat.lng} />}
        </MapContainer>
    );
};

export default Earth2D;
