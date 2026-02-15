import { useState, useEffect } from 'react';

export interface FirePoint {
    id: string;
    lat: number;
    lng: number;
    brightness: number; // Kelvin
    confidence: 'low' | 'nominal' | 'high';
    acquisitionDate: string;
}

export const useWildfireData = () => {
    const [data, setData] = useState<FirePoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<'REAL' | 'SIMULATED'>('SIMULATED');

    // TODO: Integrate with backend /api/wildfires endpoint here
    // const fetchRealData = async () => { ... }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Try fetching real data from local backend
                const response = await fetch('http://localhost:3000/api/wildfires');

                if (response.ok) {
                    const result = await response.json();
                    if (result.data && result.data.length > 0) {
                        setData(result.data);
                        setSource('REAL');
                        setLoading(false);
                        return;
                    }
                }

                throw new Error("Failed to load real data or empty");

            } catch (err) {
                console.warn("Falling back to simulated wildfire data:", err);
                // Fallback to simulated
                const mockFires: FirePoint[] = [];

                // Amazon cluster
                for (let i = 0; i < 15; i++) {
                    mockFires.push({
                        id: `amz-${i}`,
                        lat: -10 + (Math.random() - 0.5) * 5,
                        lng: -60 + (Math.random() - 0.5) * 5,
                        brightness: 300 + Math.random() * 50,
                        confidence: Math.random() > 0.5 ? 'high' : 'nominal',
                        acquisitionDate: new Date().toISOString()
                    });
                }

                // California cluster
                for (let i = 0; i < 8; i++) {
                    mockFires.push({
                        id: `cal-${i}`,
                        lat: 38 + (Math.random() - 0.5) * 4,
                        lng: -120 + (Math.random() - 0.5) * 3,
                        brightness: 320 + Math.random() * 60,
                        confidence: 'high',
                        acquisitionDate: new Date().toISOString()
                    });
                }

                // Australia cluster
                for (let i = 0; i < 12; i++) {
                    mockFires.push({
                        id: `aus-${i}`,
                        lat: -30 + (Math.random() - 0.5) * 8,
                        lng: 140 + (Math.random() - 0.5) * 8,
                        brightness: 310 + Math.random() * 40,
                        confidence: Math.random() > 0.3 ? 'high' : 'nominal',
                        acquisitionDate: new Date().toISOString()
                    });
                }

                setTimeout(() => {
                    setData(mockFires);
                    setSource('SIMULATED');
                    setLoading(false);
                }, 1000);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error: null, source };
};
