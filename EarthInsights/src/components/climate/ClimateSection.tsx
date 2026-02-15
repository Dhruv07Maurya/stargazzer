import { useState } from 'react';
import { TemperatureChart } from './TemperatureChart';
import TemperatureMap from './TemperatureMap';
import StormMap from './StormMap';

const ClimateSection = () => {
    const [activeTab, setActiveTab] = useState('temp');

    const tabs = [
        { id: 'temp', label: 'Global Temperature' },
        { id: 'storm', label: 'Storm Tracking' },
    ];

    return (
        <div className="p-6 space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between flex-shrink-0">
                <h2 className="text-3xl font-bold">Climate Monitoring</h2>
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
                    {activeTab === 'temp' && (
                        <>
                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex-1 min-h-[300px] relative flex flex-col">
                                <h3 className="flex-shrink-0 mb-2 text-xs font-bold text-neutral-500 uppercase tracking-wider z-10">Global Anomaly Trend (1880 - Present)</h3>
                                <div className="flex-1 w-full min-h-0">
                                    <TemperatureChart />
                                </div>
                            </div>
                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex-1 min-h-[300px] relative flex flex-col">
                                <h3 className="flex-shrink-0 mb-2 text-xs font-bold text-neutral-500 uppercase tracking-wider z-10">Critical Heat Anomalies</h3>
                                <div className="flex-1 w-full min-h-0 rounded-lg overflow-hidden relative z-0">
                                    <TemperatureMap />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'storm' && (
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 h-full relative flex flex-col">
                            <h3 className="flex-shrink-0 mb-2 text-xs font-bold text-neutral-500 uppercase tracking-wider z-10">Active Hurricane/Typhoon Tracker</h3>
                            <div className="flex-1 w-full min-h-0 relative rounded-lg overflow-hidden z-0">
                                <StormMap />
                            </div>
                        </div>
                    )}

                    {activeTab !== 'temp' && activeTab !== 'storm' && (
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 h-full flex items-center justify-center">
                            <p className="text-neutral-500">Visualization Component Placeholder for {activeTab}</p>
                        </div>
                    )}
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">Analysis & Impact</h3>

                    {activeTab === 'temp' && (
                        <div className="space-y-6 text-sm text-neutral-300">
                            <section>
                                <h4 className="font-bold text-white mb-2">What is a Temperature Anomaly?</h4>
                                <p>
                                    A temperature anomaly is the departure from a reference value or long-term average.
                                    A positive anomaly indicates that the observed temperature was warmer than the reference value.
                                </p>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">Why +1.2°C Matters</h4>
                                <p>
                                    Global temperatures have risen by approximately 1.2°C since the pre-industrial era.
                                    This seemingly small shift destabilizes global weather patterns.
                                </p>
                            </section>
                        </div>
                    )}

                    {activeTab === 'storm' && (
                        <div className="space-y-6 text-sm text-neutral-300">
                            <section>
                                <h4 className="font-bold text-white mb-2">Projected Path Accuracy</h4>
                                <p>
                                    Storm tracks show the probable path of the storm center (cone of uncertainty).
                                    Red lines indicate future projections based on current atmospheric models.
                                </p>
                            </section>

                            <section>
                                <h4 className="font-bold text-white mb-2">Category Scale (Saffir-Simpson)</h4>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li><span className="text-yellow-400">Cat 1-2:</span> Dangerous winds (119-177 km/h)</li>
                                    <li><span className="text-orange-500">Cat 3-4:</span> Major damage (178-251 km/h)</li>
                                    <li><span className="text-red-600">Cat 5:</span> Catastrophic (&gt;252 km/h)</li>
                                </ul>
                            </section>
                        </div>
                    )}

                    {activeTab !== 'temp' && activeTab !== 'storm' && (
                        <p className="text-neutral-400">Select data to view insights.</p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ClimateSection;
