import { useState } from 'react';
import WildfireMap from './WildfireMap';

const DisasterSection = () => {
    const [activeTab, setActiveTab] = useState('wildfire');

    const tabs = [
        { id: 'wildfire', label: 'Wildfires' },
    ];

    return (
        <div className="p-6 space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between flex-shrink-0">
                <h2 className="text-3xl font-bold">Disaster Monitoring</h2>
                <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-neutral-800 text-white shadow-sm'
                                : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 min-h-[500px] flex flex-col">
                    {activeTab === 'wildfire' ? (
                        <div className="flex-1 w-full min-h-0 relative rounded-lg overflow-hidden">
                            <WildfireMap />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-neutral-500">
                            Placeholder for {activeTab}
                        </div>
                    )}
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4 text-orange-400">Impact Assessment</h3>

                    {activeTab === 'wildfire' && (
                        <div className="space-y-6 text-sm text-neutral-300">
                            <section>
                                <h4 className="font-bold text-white mb-2">Real-Time Heat Alerts</h4>
                                <p>
                                    Data is sourced from MODIS and VIIRS satellites which detect thermal anomalies.
                                    Clusters of red points indicate probable active fires.
                                </p>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">Why It Matters</h4>
                                <p>
                                    Wildfires release massive amounts of CO2 and destroy biodiversity.
                                    Early detection allows for faster response and evacuation.
                                </p>
                            </section>

                            <div className="pt-4 border-t border-neutral-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span className="text-xs">High Confidence Fire</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                                    <span className="text-xs">Nominal Confidence Fire</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'wildfire' && (
                        <p className="text-neutral-400">Select Wildfires to view live data.</p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default DisasterSection;
