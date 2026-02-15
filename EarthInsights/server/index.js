require('dotenv').config();
const express = require('express');
const cors = require('cors');
const temperatureRoutes = require('./routes/temperature');
const stormRoutes = require('./routes/storms');
const wildfireRoutes = require('./routes/wildfire');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/temperature', temperatureRoutes);
app.use('/api/storms', stormRoutes);
app.use('/api/wildfires', wildfireRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
