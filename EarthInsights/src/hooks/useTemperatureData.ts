import { useState, useEffect } from 'react';

export interface TemperatureDataPoint {
    year: number;
    anomaly: number;
}

export interface TemperatureHookResult {
    data: TemperatureDataPoint[];
    loading: boolean;
    error: string | null;
    source: 'REAL' | 'SIMULATED';
    location?: { lat: number, lon: number };
}

export const useTemperatureData = (): TemperatureHookResult => {
    const [data, setData] = useState<TemperatureDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<'REAL' | 'SIMULATED'>('SIMULATED');
    const [location, setLocation] = useState<{ lat: number, lon: number } | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // 1. Determine Location (Default to Mumbai if geolocation fails/denied)
            let lat = 19.0760;
            let lon = 72.8777;

            try {
                // Simple timeout for geolocation to not block too long
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);
                    navigator.geolocation.getCurrentPosition(
                        (pos) => { clearTimeout(timeout); resolve(pos); },
                        (err) => { clearTimeout(timeout); reject(err); }
                    );
                });
                lat = position.coords.latitude;
                lon = position.coords.longitude;
            } catch (e) {
                console.log('Using default location (Mumbai)');
            }

            setLocation({ lat, lon });

            // 2. Try Fetching Real Data
            try {
                const response = await fetch(`http://localhost:3000/api/temperature?lat=${lat}&lon=${lon}`);
                if (!response.ok) throw new Error('Backend unavailable');

                const result = await response.json();

                // Normalization check (ensure it matches expected shape)
                if (Array.isArray(result.data) && result.data.length > 0) {
                    setData(result.data);
                    setSource('REAL');
                    setLoading(false);
                    return; // Exit success
                }
            } catch (err) {
                console.warn('Falling back to simulated data:', err);
            }

            // 3. Fallback to Dummy Data
            generateDummyData();
        };

        const generateDummyData = () => {
            // Mock data representing global temperature anomalies (baseline 1951-1980)
            const mockData: TemperatureDataPoint[] = Array.from({ length: 144 }, (_, i) => {
                const year = 1880 + i;
                // Simplified trend simulation
                const trend = i > 100 ? (i - 100) * 0.02 + 0.3 : (i > 60 ? 0.1 : -0.1);
                const noise = (Math.random() - 0.5) * 0.2;
                return {
                    year,
                    anomaly: parseFloat((trend + noise).toFixed(2))
                };
            });

            setTimeout(() => {
                setData(mockData);
                setSource('SIMULATED');
                setLoading(false);
            }, 800);
        };

        fetchData();
    }, []);

    return { data, loading, error: null, source, location };
};
