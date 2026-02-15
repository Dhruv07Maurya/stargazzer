import React, { useState } from 'react';
import Earth3D from './Earth3D';
import Earth2D from './Earth2D';
import './VisualizerContainer.css';
import { SatellitePosition, SatellitePath } from '../../hooks/useSatelliteGroup';

interface VisualizerContainerProps {
    positions: SatellitePosition[];
    selectedSatId: string | null;
    onSatelliteSelect: (id: string) => void;
    getPath: (id: string) => SatellitePath[];
}

const VisualizerContainer: React.FC<VisualizerContainerProps> = ({
    positions,
    selectedSatId,
    onSatelliteSelect,
    getPath
}) => {
    const [mode, setMode] = useState<'3D' | '2D'>('3D');

    return (
        <div className="visualizer-wrapper">
            <div className="visualizer-controls">
                <button
                    className={mode === '3D' ? 'active' : ''}
                    onClick={() => setMode('3D')}
                >
                    3D View
                </button>
                <button
                    className={mode === '2D' ? 'active' : ''}
                    onClick={() => setMode('2D')}
                >
                    2D Map
                </button>
            </div>
            {mode === '3D' ? (
                <Earth3D
                    positions={positions}
                    onSatelliteClick={(p) => onSatelliteSelect(p.id)}
                    selectedSatId={selectedSatId}
                />
            ) : (
                <Earth2D
                    positions={positions}
                    selectedSatId={selectedSatId}
                    onSatelliteClick={(id) => onSatelliteSelect(id)}
                    path={selectedSatId ? getPath(selectedSatId) : []}
                />
            )}
        </div>
    );
};

export default VisualizerContainer;
