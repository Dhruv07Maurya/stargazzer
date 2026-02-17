import { NavLink } from 'react-router-dom';
import {
    IoHome, IoTelescope, IoRocket, IoSunny, IoEarth,
    IoMap, IoSchool, IoNotifications, IoSettings, IoAnalytics
} from 'react-icons/io5';

const navItems = [
    { path: '/', label: 'Home', icon: <IoHome />, desc: "What's happening" },
    { path: '/sky-events', label: 'Sky Events', icon: <IoTelescope />, desc: 'What can I see' },
    { path: '/missions', label: 'Missions', icon: <IoRocket />, desc: 'What humans are doing' },
    { path: '/space-weather', label: 'Space Weather', icon: <IoSunny />, desc: 'What the Sun is doing' },
    { path: '/earth-insights', label: 'Earth Insights', icon: <IoEarth />, desc: 'How satellites help' },
    { path: '/sky-map', label: 'Sky Map', icon: <IoMap />, desc: 'Explore visually' },
    { path: '/learn', label: 'Learn', icon: <IoSchool />, desc: 'Understand deeply' },
    { path: '/alerts', label: 'Alerts', icon: <IoNotifications />, desc: 'Stay updated' },
    { path: '/preferences', label: 'Preferences', icon: <IoSettings />, desc: 'Personalize' },
    { path: '/explore-data', label: 'Explore Data', icon: <IoAnalytics />, desc: 'Go deeper' },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span className="logo-icon">🔭</span>
                <h1>ASTROVIEW</h1>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Powered by AstroView
            </div>
        </aside>
    );
}

export { navItems };
