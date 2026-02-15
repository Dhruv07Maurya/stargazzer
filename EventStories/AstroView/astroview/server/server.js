/**
 * AstroView Server — Express API proxy with caching
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const config = require('./config/apiConfig');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/launches', require('./routes/launches'));
app.use('/api/sky-events', require('./routes/skyEvents'));
app.use('/api/space-weather', require('./routes/spaceWeather'));
app.use('/api/earth-insights', require('./routes/earthInsights'));
app.use('/api/learn', require('./routes/learn'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(config.PORT, () => {
    console.log(`🚀 AstroView server running on port ${config.PORT}`);
});
