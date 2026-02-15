'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './SolarSystem.css'; // Import the CSS file

const planetDetails: Record<string, { name: string; description: string; orbitRadius: number }> = {
    mercury: { name: 'Mercury', description: 'The smallest planet in our solar system and closest to the Sun.', orbitRadius: 9 },
    venus: { name: 'Venus', description: 'The second planet from the Sun and the hottest planet in our solar system.', orbitRadius: 12 },
    earth: { name: 'Earth', description: 'Our home planet, the only known planet to harbor life.', orbitRadius: 16 },
    mars: { name: 'Mars', description: 'The dusty, cold, desert world with a very thin atmosphere.', orbitRadius: 20 },
    jupiter: { name: 'Jupiter', description: 'The largest planet in our solar system, a gas giant with a Great Red Spot.', orbitRadius: 25 },
    saturn: { name: 'Saturn', description: 'Adorned with a dazzling, complex system of icy rings.', orbitRadius: 31 },
    uranus: { name: 'Uranus', description: 'An ice giant that rotates at a nearly 90-degree angle from the plane of its orbit.', orbitRadius: 38 },
    neptune: { name: 'Neptune', description: 'The eighth and most distant major planet orbiting our Sun.', orbitRadius: 46 },
    pluto: { name: 'Pluto', description: 'A dwarf planet in the Kuiper belt, a ring of bodies beyond the orbit of Neptune.', orbitRadius: 55 }
};

export default function SolarSystem() {
    const router = useRouter();
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [planetAngles, setPlanetAngles] = useState<Record<string, number>>({});
    const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const wrapperRef = useRef<HTMLDivElement>(null); // Ref for the wrapper

    const planets = [
        'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
    ];

    useEffect(() => {
        // Create stars in the background
        const createStars = () => {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;

            // Remove existing stars to prevent duplicates if re-running
            const existingStars = wrapper.querySelectorAll('.star');
            existingStars.forEach(star => star.remove());

            for (let i = 0; i < 1000; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.width = '.1px';
                star.style.height = '.1px';
                star.style.top = Math.random() * 100 + '%';
                star.style.left = Math.random() * 100 + '%';
                wrapper.appendChild(star);
            }
        };

        createStars();

        // Set random angles for planets
        const angles: Record<string, number> = {};
        planets.forEach(planet => {
            angles[planet] = Math.random() * 360;
        });
        setPlanetAngles(angles);

        // Cleanup function to remove stars when component unmounts
        return () => {
            const stars = document.querySelectorAll('.star');
            stars.forEach(star => star.remove());
        };
    }, []);

    const handleWheel = (e: React.WheelEvent) => {
        const delta = e.deltaY * -0.001;
        setZoom(prevZoom => Math.min(Math.max(prevZoom + delta, 0.1), 5));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;

        setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handlePlanetHover = (planet: string | null) => {
        setSelectedPlanet(planet);
    };

    const resetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setSelectedPlanet(null);
    };

    return (
        <div
            ref={wrapperRef}
            className={`solarSystemWrapper w-full h-screen overflow-hidden flex items-center justify-center relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="absolute bottom-10 right-10 flex gap-2 z-50">
                <button
                    className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(z - 0.2, 0.1)); }}
                >
                    -
                </button>
                <button
                    className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); resetView(); }}
                >
                    Reset
                </button>
                <button
                    className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.2, 5)); }}
                >
                    +
                </button>
            </div>

            {/* Info Panel - Shows on Hover */}
            {selectedPlanet && planetDetails[selectedPlanet] && (
                <div
                    className="absolute top-10 left-10 z-50 p-6 max-w-sm bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl text-white shadow-2xl animate-in fade-in slide-in-from-left-10 duration-300 pointer-events-none"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
                            {planetDetails[selectedPlanet].name}
                        </h2>
                    </div>
                    <p className="text-lg leading-relaxed text-gray-200">
                        {planetDetails[selectedPlanet].description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-white/10 flex gap-4 text-sm text-gray-400">
                        <div>
                            <span className="block text-xs uppercase tracking-wider text-gray-500">Orbit Radius</span>
                            {planetDetails[selectedPlanet].orbitRadius} AU (Scaled)
                        </div>
                    </div>
                </div>
            )}

            <div
                className="container transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
                style={{ transform: `translate(${pan.x / zoom}px, ${pan.y / zoom}px) scale(${zoom})` }}
            >
                <div className="sun" onClick={(e) => { e.stopPropagation(); /* Optional: select sun */ }}>
                    <img src="/images/sun.png" alt="sun" />
                </div>

                {planets.map(planet => (
                    <div
                        key={planet}
                        className={planet}
                        style={{ transform: `rotate(${planetAngles[planet] || 0}deg)` }}
                    >
                        <div
                            className="planet-img"
                            onMouseEnter={() => handlePlanetHover(planet)}
                            onMouseLeave={() => handlePlanetHover(null)}
                            onClick={() => router.push(`/quiz/${planet}`)}
                            style={{
                                width: planet === 'mercury' ? '4em' :
                                    planet === 'venus' ? '4.5em' :
                                        planet === 'earth' ? '7em' :
                                            planet === 'mars' ? '5.5em' :
                                                planet === 'jupiter' ? '9em' :
                                                    planet === 'saturn' ? '8.5em' :
                                                        planet === 'uranus' ? '7.5em' :
                                                            planet === 'neptune' ? '7.5em' :
                                                                planet === 'pluto' ? '5.5em' : '4em',
                                height: planet === 'mercury' ? '4em' :
                                    planet === 'venus' ? '4.5em' :
                                        planet === 'earth' ? '7em' :
                                            planet === 'mars' ? '5.5em' :
                                                planet === 'jupiter' ? '9em' :
                                                    planet === 'saturn' ? '8.5em' :
                                                        planet === 'uranus' ? '7.5em' :
                                                            planet === 'neptune' ? '7.5em' :
                                                                planet === 'pluto' ? '5.5em' : '4em',
                                transform: `translate(-50%, -50%) rotate(-${planetAngles[planet] || 0}deg)`
                            }}
                        >
                            <img src={`/images/${planet}.png`} alt={planet} draggable={false} />
                            {planet === 'earth' && (
                                <div className="moon">
                                    <div className="planet-img" style={{ width: '2em', height: '2em' }}>
                                        <img src="/images/moon.png" alt="moon" draggable={false} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
