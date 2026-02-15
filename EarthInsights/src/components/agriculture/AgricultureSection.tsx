import { useState } from 'react';
import { RainfallChart } from './RainfallChart';
import RainfallMap from './RainfallMap';
import NDVIMap from './NDVIMap';

const AgricultureSection = () => {
    const [activeTab, setActiveTab] = useState('rainfall');

    const tabs = [
        { id: 'rainfall', label: 'Rainfall Data' },
        { id: 'health', label: 'Crop Health (NDVI)' },
    ];

    return (
        <div className="p-6 space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between flex-shrink-0">
                <h2 className="text-3xl font-bold">Agriculture & Food Security</h2>
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
                <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
                    {activeTab === 'rainfall' && (
                        <>
                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex-1 min-h-[300px] relative flex flex-col">
                                <h3 className="flex-shrink-0 mb-2 text-xs font-bold text-neutral-500 uppercase tracking-wider z-10">Regional Precipitation Intensity</h3>
                                <div className="flex-1 w-full min-h-0 relative rounded-lg overflow-hidden z-0">
                                    <RainfallMap />
                                </div>
                            </div>
                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 h-[250px] relative flex flex-col">
                                <h3 className="flex-shrink-0 mb-2 text-xs font-bold text-neutral-500 uppercase tracking-wider z-10">7-Day Rainfall History (Global Avg)</h3>
                                <div className="flex-1 w-full min-h-0 relative">
                                    <RainfallChart />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'health' && (
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 h-full relative flex flex-col">
                            <h3 className="flex-shrink-0 mb-2 text-xs font-bold text-neutral-500 uppercase tracking-wider z-10">Global Vegetation Index (NDVI)</h3>
                            <div className="flex-1 w-full min-h-0 relative rounded-lg overflow-hidden z-0">
                                <NDVIMap />
                            </div>
                        </div>
                    )}

                    {activeTab !== 'rainfall' && activeTab !== 'health' && (
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 h-full flex items-center justify-center">
                            <p className="text-neutral-500">Visualization Component Placeholder for {activeTab}</p>
                        </div>
                    )}
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4 text-green-400">Agricultural Insight</h3>
                    {activeTab === 'rainfall' && (
                        <div className="space-y-6 text-sm text-neutral-300">
                            <section>
                                <h4 className="font-bold text-white mb-2">Satellite Rainfall Estimation</h4>
                                <p>
                                    Using GPM (Global Precipitation Measurement) data, we track rainfall intensity across key agricultural regions.
                                    Blue zones indicate active precipitation.
                                </p>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">Crop Impact</h4>
                                <p>
                                    Consistent rainfall is critical for early-stage crop development.
                                    Excessive rain (100% intensity) may indicate flood risk, while prolonged absence suggests drought onset.
                                </p>
                            </section>
                        </div>
                    )}

                    {activeTab === 'health' && (
                        <div className="space-y-6 text-sm text-neutral-300">
                            <section>
                                <h4 className="font-bold text-white mb-2">Normalized Difference Vegetation Index (NDVI)</h4>
                                <p>
                                    NDVI measures the density of green on a patch of land. High values (near 1.0) indicate deep green vegetation.
                                    Low values indicate sparse or stressed vegetation.
                                </p>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">Formula</h4>
                                <code className="block bg-neutral-950 p-2 rounded text-xs font-mono text-green-300">
                                    (NIR - Red) / (NIR + Red)
                                </code>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">Legend</h4>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-green-700"></span>
                                        <span className="text-xs">Lush Vegetation (&gt;0.7)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                                        <span className="text-xs">Moderate Stress (0.3 - 0.5)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                        <span className="text-xs">Severe Stress / Barren (&lt;0.3)</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab !== 'rainfall' && activeTab !== 'health' && (
                        <p className="text-neutral-400">Select data to view agricultural insights.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgricultureSection;
