import { useState, useEffect } from 'react';
import * as SunCalc from 'suncalc';
import eclipses from '../../data/eclipses.json';

interface LunarTableProps {
    location: { lat: number; lng: number } | null;
}

const LunarTable = ({ location }: LunarTableProps) => {
    const [moonData, setMoonData] = useState<any>(null);

    useEffect(() => {
        const now = new Date();
        const illumination = SunCalc.getMoonIllumination(now);
        let times: any = {};

        if (location) {
            times = SunCalc.getMoonTimes(now, location.lat, location.lng);
        }

        setMoonData({ ...illumination, ...times });
    }, [location]);

    const getPhaseName = (phase: number) => {
        if (phase < 0.03) return 'New Moon';
        if (phase < 0.25) return 'Waxing Crescent';
        if (phase < 0.28) return 'First Quarter';
        if (phase < 0.50) return 'Waxing Gibbous';
        if (phase < 0.53) return 'Full Moon';
        if (phase < 0.75) return 'Waning Gibbous';
        if (phase < 0.78) return 'Last Quarter';
        return 'Waning Crescent';
    };

    return (
        <div className="card">
            <h2>Lunar Phase & Eclipses</h2>
            {moonData && (
                <div className="moon-status">
                    <p>Current Phase: <strong>{getPhaseName(moonData.phase)}</strong> ({Math.round(moonData.fraction * 100)}%)</p>
                    {location ? (
                        <div className="moon-times">
                            <span>Rise: {moonData.rise ? moonData.rise.toLocaleTimeString() : 'N/A'}</span>
                            <span>Set: {moonData.set ? moonData.set.toLocaleTimeString() : 'N/A'}</span>
                        </div>
                    ) : (
                        <p>Allow location for rise/set times.</p>
                    )}
                </div>
            )}

            <h3>Upcoming Eclipses</h3>
            <table className="eclipse-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Region</th>
                    </tr>
                </thead>
                <tbody>
                    {eclipses.map((eclipse, index) => (
                        <tr key={index}>
                            <td>{eclipse.type}</td>
                            <td>{eclipse.date}</td>
                            <td>{eclipse.visibilityRegion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LunarTable;
