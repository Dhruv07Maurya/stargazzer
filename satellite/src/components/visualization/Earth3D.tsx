import React, { useEffect, useRef, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { SatellitePosition } from '../../hooks/useSatelliteGroup';
import { getGroupColor } from '../../data/satellites';

interface Earth3DProps {
    positions: SatellitePosition[];
    onSatelliteClick: (sat: SatellitePosition) => void;
    selectedSatId: string | null;
}

const Earth3D: React.FC<Earth3DProps> = ({ positions, onSatelliteClick, selectedSatId }) => {
    const globeEl = useRef<GlobeMethods | undefined>(undefined);

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
        }
    }, []);

    // Memoize points data to avoid unnecessary re-renders (though positions change every sec)
    const pointsData = useMemo(() => positions.map(pos => ({
        ...pos,
        color: pos.id === selectedSatId ? '#ffffff' : getGroupColor(pos.group),
        radius: pos.id === selectedSatId ? 1.5 : 0.5,
        altNormalized: pos.alt / 6371
    })), [positions, selectedSatId]);

    return (
        <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

            objectsData={pointsData}
            objectLat="lat"
            objectLng="lng"
            objectAltitude="altNormalized"
            objectLabel={(obj: any) => `${obj.group}: ${obj.id}`}
            // @ts-ignore
            objectColor="color"
            // @ts-ignore
            objectRadius="radius"
            onObjectClick={(obj: any) => onSatelliteClick(obj)}
        />
    );
};

export default Earth3D;
