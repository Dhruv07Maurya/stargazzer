import meteorShowers from '../../data/meteorShowers.json';

const MeteorCalendar = () => {
    const sortedShowers = [...meteorShowers].sort((a, b) => {
        const dateA = new Date(a.peakDate).getTime();
        const dateB = new Date(b.peakDate).getTime();
        // Since dates are in the future (2026), just sort by date
        return dateA - dateB;
    });

    return (
        <div className="card">
            <h2>Meteor Shower Calendar</h2>
            <div className="meteor-grid">
                {sortedShowers.map((shower) => {
                    const daysRemaining = Math.ceil((new Date(shower.peakDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                        <div key={shower.name} className="meteor-item">
                            <h3>{shower.name}</h3>
                            <p>Peak: {shower.peakDate}</p>
                            <p>Radiant: {shower.radiant}</p>
                            <p>Rate: {shower.expectedRate} / hr</p>
                            <p className="highlight">{daysRemaining > 0 ? `${daysRemaining} days left` : 'Passed'}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MeteorCalendar;
