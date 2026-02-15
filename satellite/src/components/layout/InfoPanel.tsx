import React from 'react';

interface InfoPanelProps {
    children: React.ReactNode;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ children }) => {
    return (
        <div className="info-panel">
            {children}
        </div>
    );
};

export default InfoPanel;
