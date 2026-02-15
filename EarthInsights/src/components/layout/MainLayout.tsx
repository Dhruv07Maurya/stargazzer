import React from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    activeSection: string;
    onNavigate: (section: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeSection, onNavigate }) => {
    return (
        <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
            <Sidebar activeSection={activeSection} onNavigate={onNavigate} />
            <main className="flex-1 overflow-auto relative">
                {children}
            </main>
        </div>
    );
};
