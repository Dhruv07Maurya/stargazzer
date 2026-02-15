import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import SkyEvents from './pages/SkyEvents';
import Missions from './pages/Missions';
import SpaceWeather from './pages/SpaceWeather';
import EarthInsights from './pages/EarthInsights';
import SkyMap from './pages/SkyMap';
import Learn from './pages/Learn';
import Alerts from './pages/Alerts';
import Preferences from './pages/Preferences';
import ExploreData from './pages/ExploreData';

function App() {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sky-events" element={<SkyEvents />} />
                    <Route path="/missions" element={<Missions />} />
                    <Route path="/space-weather" element={<SpaceWeather />} />
                    <Route path="/earth-insights" element={<EarthInsights />} />
                    <Route path="/sky-map" element={<SkyMap />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/preferences" element={<Preferences />} />
                    <Route path="/explore-data" element={<ExploreData />} />
                </Routes>
            </main>
            <MobileNav />
        </div>
    );
}

export default App;
