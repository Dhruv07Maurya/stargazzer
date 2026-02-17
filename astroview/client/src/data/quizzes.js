/**
 * Interactive quiz questions — for the Learn section
 */
const quizzes = [
    {
        id: 'basics',
        title: 'Space Basics',
        difficulty: 'Beginner',
        questions: [
            {
                q: 'What is the closest star to Earth?',
                options: ['Sirius', 'Alpha Centauri', 'The Sun', 'Polaris'],
                answer: 2,
                explanation: 'The Sun is a star! It\'s about 150 million km away. The next closest star system is Alpha Centauri at 4.37 light-years.'
            },
            {
                q: 'How long does it take light from the Sun to reach Earth?',
                options: ['1 second', '8 minutes', '1 hour', '1 day'],
                answer: 1,
                explanation: 'Light travels at about 300,000 km/s and the Sun is ~150 million km away, so it takes about 8 minutes and 20 seconds.'
            },
            {
                q: 'What causes a "shooting star"?',
                options: ['A star falling', 'A meteor burning in atmosphere', 'Satellite debris', 'Lightning'],
                answer: 1,
                explanation: 'Shooting stars are small rocks (meteors) from space burning up as they enter Earth\'s atmosphere at high speed, creating a bright streak.'
            },
            {
                q: 'What is the ISS?',
                options: ['A telescope', 'A space station', 'A satellite', 'A rocket'],
                answer: 1,
                explanation: 'The International Space Station is a large habitable spacecraft in low Earth orbit where astronauts live and conduct research.'
            },
            {
                q: 'Which planet is known as the Red Planet?',
                options: ['Venus', 'Jupiter', 'Mars', 'Mercury'],
                answer: 2,
                explanation: 'Mars appears red because its surface is covered in iron oxide (rust). Multiple rovers are currently exploring its surface.'
            },
        ]
    },
    {
        id: 'satellites',
        title: 'Satellites & Earth',
        difficulty: 'Intermediate',
        questions: [
            {
                q: 'What does a weather satellite mainly observe?',
                options: ['Star positions', 'Cloud patterns and storms', 'Asteroid orbits', 'Galaxy formations'],
                answer: 1,
                explanation: 'Weather satellites monitor cloud cover, storm systems, temperature, and humidity to help forecast weather.'
            },
            {
                q: 'What does NDVI measure from space?',
                options: ['Ocean depth', 'Air pollution', 'Vegetation health', 'Earthquake risk'],
                answer: 2,
                explanation: 'NDVI uses satellite data to measure how healthy and green vegetation is. It\'s essential for agriculture and drought monitoring.'
            },
            {
                q: 'How high is the ISS above Earth?',
                options: ['40 km', '400 km', '4,000 km', '40,000 km'],
                answer: 1,
                explanation: 'The ISS orbits at approximately 400 km altitude, completing one orbit around Earth every ~90 minutes.'
            },
            {
                q: 'What is a geostationary orbit used for?',
                options: ['Space tourism', 'TV broadcasting & weather', 'Mining asteroids', 'Mars missions'],
                answer: 1,
                explanation: 'At ~36,000 km, satellites match Earth\'s rotation and appear stationary from the ground — perfect for TV, weather, and communication.'
            },
            {
                q: 'How can satellites help during floods?',
                options: ['They stop the rain', 'They map affected areas', 'They absorb water', 'They predict earthquakes'],
                answer: 1,
                explanation: 'Satellites capture images of flooded regions, helping rescue teams identify affected areas and plan relief operations.'
            },
        ]
    },
    {
        id: 'space-weather',
        title: 'Space Weather',
        difficulty: 'Advanced',
        questions: [
            {
                q: 'What is the Kp index?',
                options: ['Planet size ranking', 'Geomagnetic activity scale', 'Star brightness', 'Satellite count'],
                answer: 1,
                explanation: 'The Kp index (0-9) measures disturbances in Earth\'s magnetic field. Higher Kp = more storm activity = better aurora visibility.'
            },
            {
                q: 'What can a strong solar flare disrupt on Earth?',
                options: ['Gravity', 'Radio communications', 'Tides', 'Seasons'],
                answer: 1,
                explanation: 'Solar flares emit radiation that can disrupt radio signals, GPS accuracy, and even power grids during extreme events.'
            },
            {
                q: 'What causes the Northern Lights (Aurora Borealis)?',
                options: ['Moonlight reflection', 'Solar particles hitting atmosphere', 'Volcanic gases', 'Ocean bioluminescence'],
                answer: 1,
                explanation: 'Charged particles from the Sun interact with gases in Earth\'s upper atmosphere, causing them to glow in beautiful colors.'
            },
            {
                q: 'What is a Coronal Mass Ejection (CME)?',
                options: ['A sunspot', 'A burst of plasma from the Sun', 'A comet', 'An eclipse'],
                answer: 1,
                explanation: 'CMEs are massive clouds of magnetized plasma ejected from the Sun that can cause geomagnetic storms when they reach Earth.'
            },
            {
                q: 'How long does it take a CME to reach Earth?',
                options: ['8 minutes', '1-3 days', '1 month', '1 year'],
                answer: 1,
                explanation: 'Unlike light (8 min), CMEs travel at 250-3,000 km/s and typically take 1-3 days to reach Earth.'
            },
        ]
    }
];

export default quizzes;
