import { useState, useEffect } from 'react';

export interface NVDIRegion {
    id: string;
    lat: number;
    lng: number;
    health: number; // -1 to 1 (NDVI scale)
    radius: number; // km
    cropType: string;
}

export const useNDVIData = () => {
    const [data, setData] = useState<NVDIRegion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock NDVI Data
        const loadData = () => {
            setLoading(true);

            const regions: NVDIRegion[] = [
                { id: 'us-midwest', lat: 41.0, lng: -95.0, health: 0.8, radius: 400, cropType: 'Corn/Soybean' },
                { id: 'ukraine', lat: 49.0, lng: 32.0, health: 0.6, radius: 300, cropType: 'Wheat' },
                { id: 'brazil-soy', lat: -15.0, lng: -55.0, health: 0.75, radius: 350, cropType: 'Soybean' },
                { id: 'india-punjab', lat: 31.0, lng: 75.0, health: 0.4, radius: 150, cropType: 'Rice/Wheat' }, // Stressed
                { id: 'ca-central-valley', lat: 37.0, lng: -120.0, health: 0.3, radius: 100, cropType: 'Almonds/Grapes' }, // Drought stress
            ];

            setTimeout(() => {
                setData(regions);
                setLoading(false);
            }, 700);
        };

        loadData();
    }, []);

    return { data, loading };
};
