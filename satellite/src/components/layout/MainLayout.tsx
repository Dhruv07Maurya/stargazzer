import React from 'react';
import './MainLayout.css';

interface MainLayoutProps {
    visualizer: React.ReactNode;
    infoPanel: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ visualizer, infoPanel }) => {
    return (
        <div className="main-layout">
            <div className="visualizer-container">
                {visualizer}
            </div>
            <div className="info-panel-container">
                {infoPanel}
            </div>
        </div>
    );
};

export default MainLayout;
