import { useState, useEffect } from 'react';

export interface StormTrack {
    id: string;
    name: string;
    category: number; // 1-5
    windSpeed: number; // km/h
    path: [number, number][]; // lat, lng
    projectedPath: [number, number][];
    description?: string;
}

export interface StormHookResult {
    data: StormTrack[];
    loading: boolean;
    source: 'REAL' | 'SIMULATED';
}

export const useStormData = (): StormHookResult => {
    const [data, setData] = useState<StormTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<'REAL' | 'SIMULATED'>('SIMULATED');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // 1. Try Fetching Real Data (Weather.gov via Backend)
            try {
                const response = await fetch('http://localhost:3000/api/storms');
                if (!response.ok) throw new Error('Backend unavailable');

                const result = await response.json();

                if (Array.isArray(result.data) && result.data.length > 0) {
                    setData(result.data);
                    setSource('REAL');
                    setLoading(false);
                    return;
                } else if (result.source === 'WEATHER_GOV' && result.data.length === 0) {
                    // Real API returned 0 storms. 
                    console.log('No active storms found from API, falling back to dummy for demo.');
                }

            } catch (err) {
                console.warn('Falling back to simulated data:', err);
            }

            // 2. Fallback to Dummy Data
            loadDummyData();
        };

        const loadDummyData = () => {
            const storms: StormTrack[] = [
                {
                    id: 'hurricane-zenith',
                    name: 'Hurricane Zenith',
                    category: 4,
                    windSpeed: 215,
                    path: [
                        [15.0, -45.0], [16.5, -48.0], [18.2, -52.0], [20.5, -57.0], [23.0, -62.0]
                    ],
                    projectedPath: [
                        [23.0, -62.0], [25.5, -68.0], [28.0, -74.0], [31.0, -78.0]
                    ],
                    description: "Simulated Category 4 Hurricane"
                },
                {
                    id: 'typhoon-kira',
                    name: 'Typhoon Kira',
                    category: 2,
                    windSpeed: 160,
                    path: [
                        [10.0, 140.0], [12.0, 135.0], [15.0, 130.0]
                    ],
                    projectedPath: [
                        [15.0, 130.0], [18.0, 125.0], [22.0, 122.0]
                    ],
                    description: "Simulated Category 2 Typhoon"
                }
            ];

            setTimeout(() => {
                setData(storms);
                setSource('SIMULATED');
                setLoading(false);
            }, 700);
        };

        fetchData();
    }, []);

    return { data, loading, source };
};
