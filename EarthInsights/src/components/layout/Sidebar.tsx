import React from 'react';
import { ThermometerSun, Wheat, AlertTriangle, Globe } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
    activeSection: string;
    onNavigate: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate }) => {
    const navItems = [
        { id: 'climate', label: 'Climate', icon: ThermometerSun },
        { id: 'agriculture', label: 'Agriculture', icon: Wheat },
        { id: 'disaster', label: 'Disaster', icon: AlertTriangle },
    ];

    return (
        <div className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen">
            <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
                <Globe className="h-6 w-6 text-blue-500" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    EarthInsights
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                                isActive
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-800">
                <div className="text-xs text-neutral-500 text-center">
                    Space Platform Module v1.0
                </div>
            </div>
        </div>
    );
};
