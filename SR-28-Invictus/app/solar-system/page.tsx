'use client';

import { useEffect, useState } from 'react';
import SolarSystem from '@/components/SolarSystem';
import Apod from '@/components/Apod';
import AiExplanation from '@/components/AiExplanation';

interface ApodData {
    title: string;
    url: string;
    hdurl?: string;
    explanation: string;
    date: string;
    media_type: string;
}

export default function SolarSystemPage() {
    const [apodData, setApodData] = useState<ApodData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApod = async () => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
                const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
                if (response.ok) {
                    const data = await response.json();
                    setApodData(data);
                }
            } catch (err) {
                console.error('Failed to fetch APOD:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchApod();
    }, []);

    return (
        <main className="min-h-screen bg-black overflow-y-auto scroll-smooth pb-20">
            {/* Top Section: Solar System - Full height initial view */}
            <section className="relative h-screen border-b border-white/5">
                <SolarSystem />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
                    <h1 className="text-4xl font-bold text-white tracking-tighter sm:text-5xl md:text-6xl mb-2 opacity-80">
                        Interactive Solar System
                    </h1>
                    <p className="text-white/40 text-sm uppercase tracking-[0.2em]">Click on a planet to test your knowledge</p>
                </div>
                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 z-10">
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mb-2 text-center">Scroll to Discover</p>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent mx-auto rounded-full" />
                </div>
            </section>

            {/* Middle Section: APOD (Restored) */}
            <div className="relative pt-20">
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                {loading ? (
                    <div className="max-w-6xl mx-auto px-4 py-24 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                        </div>
                    </div>
                ) : apodData ? (
                    <>
                        <Apod data={apodData} />
                        <AiExplanation
                            title={apodData.title}
                            description={apodData.explanation}
                        />
                    </>
                ) : (
                    <div className="text-center py-20 text-white/40">
                        Unable to load cosmic discovery data.
                    </div>
                )}
            </div>

            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
            </div>
        </main>
    );
}
