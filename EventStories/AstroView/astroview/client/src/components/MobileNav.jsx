import { NavLink } from 'react-router-dom';
import { IoHome, IoTelescope, IoRocket, IoSunny, IoEarth, IoSchool } from 'react-icons/io5';

const mobileItems = [
    { path: '/', label: 'Home', icon: <IoHome /> },
    { path: '/sky-events', label: 'Sky', icon: <IoTelescope /> },
    { path: '/missions', label: 'Missions', icon: <IoRocket /> },
    { path: '/space-weather', label: 'Weather', icon: <IoSunny /> },
    { path: '/earth-insights', label: 'Earth', icon: <IoEarth /> },
    { path: '/learn', label: 'Learn', icon: <IoSchool /> },
];

export default function MobileNav() {
    return (
        <nav className="mobile-nav">
            <div className="mobile-nav-inner">
                {mobileItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
