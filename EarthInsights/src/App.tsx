import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import ClimateSection from './components/climate/ClimateSection';
import AgricultureSection from './components/agriculture/AgricultureSection';
import DisasterSection from './components/disaster/DisasterSection';

function App() {
    const [activeSection, setActiveSection] = useState('climate');

    const renderSection = () => {
        switch (activeSection) {
            case 'climate':
                return <ClimateSection />;
            case 'agriculture':
                return <AgricultureSection />;
            case 'disaster':
                return <DisasterSection />;
            default:
                return <ClimateSection />;
        }
    };

    return (
        <MainLayout activeSection={activeSection} onNavigate={setActiveSection}>
            {renderSection()}
        </MainLayout>
    );
}

export default App;
