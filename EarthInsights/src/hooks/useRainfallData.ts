import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';

export interface RainfallDataPoint {
    date: string;
    mm: number;
}

export interface RainfallRegion {
    id: string;
    lat: number;
    lng: number;
    intensity: number; // 0-100%
    radius: number; // km
}

export const useRainfallData = () => {
    const [weeklyData, setWeeklyData] = useState<RainfallDataPoint[]>([]);
    const [regions, setRegions] = useState<RainfallRegion[]>([]);
    const [loading, setLoading] = useState(true);

    const [source, setSource] = useState<'REAL' | 'SIMULATED'>('SIMULATED');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // 1. Determine Location
            let lat = 19.0760;
            let lon = 72.8777;

            try {
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

            // 2. Fetch Real Data
            try {
                const response = await fetch(`http://localhost:3000/api/temperature?lat=${lat}&lon=${lon}`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.data && result.data.length > 0) {
                        // Transform data for Rainfall
                        // Result data has { year, anomaly, rainfall }
                        const latestYears = result.data.slice(-7); // Last 7 years as proxy for "recent history"? 
                        // Or just map the last few entries

                        const newHistory = latestYears.map((d: any) => ({
                            date: d.year.toString(),
                            mm: d.rainfall * 30 // Convert daily avg to monthly approx
                        }));

                        // Create a "Real" region for the user's location
                        const userRegion: RainfallRegion = {
                            id: 'user-loc',
                            lat: lat,
                            lng: lon,
                            intensity: newHistory[newHistory.length - 1].mm > 100 ? 90 : 50, // Arbitrary based on rain
                            radius: 200
                        };

                        setWeeklyData(newHistory);
                        setRegions([userRegion]);
                        setSource('REAL');
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Falling back to simulated rainfall:", err);
            }

            // 3. Fallback Mock Data
            const history = Array.from({ length: 7 }, (_, i) => {
                const date = subDays(new Date(), 6 - i);
                return {
                    date: format(date, 'MMM dd'),
                    mm: Math.random() * 25 + (Math.random() > 0.7 ? 20 : 0) // Random rain with some heavy days
                };
            });

            // Active Rainfall Regions (Mock Radar)
            const activeRegions: RainfallRegion[] = [
                { id: 'r1', lat: 15.0, lng: 100.0, intensity: 80, radius: 200 }, // SE Asia
                { id: 'r2', lat: -5.0, lng: -60.0, intensity: 60, radius: 300 }, // Amazon
                { id: 'r3', lat: 45.0, lng: -122.0, intensity: 40, radius: 100 }, // PNW
                { id: 'r4', lat: 51.5, lng: -0.1, intensity: 30, radius: 80 },   // UK
            ];

            setTimeout(() => {
                setWeeklyData(history);
                setRegions(activeRegions);
                setLoading(false);
                setSource('SIMULATED');
            }, 800);
        };

        loadData();
    }, []);

    return { weeklyData, regions, loading, source };
};
