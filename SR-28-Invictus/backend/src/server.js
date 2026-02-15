/**
 * AstroView Backend Server
 * Express.js API Server running on port 5000
 * 
 * This is the main entry point for the backend API.
 * All routes are defined in the src/routes/ directory.
 * 
 * External API Integration Points:
 * - NASA APIs: Space events, solar data, asteroid tracking
 * - N2YO API: Satellite TLE data and tracking
 * - NOAA: Space weather data
 * - Groq/OpenAI: AI chat capabilities
 * - MongoDB: User data, posts, missions tracking
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * ROUTES - All API endpoints are imported and registered here
 * TODO: Implement each route with proper business logic
 */

// Import route files (to be created)
// import authRoutes from './routes/auth.routes.js'
// import postsRoutes from './routes/posts.routes.js'
// import eventsRoutes from './routes/events.routes.js'
// import missionsRoutes from './routes/missions.routes.js'
// import solarRoutes from './routes/solar.routes.js'
// import satelliteRoutes from './routes/satellites.routes.js'
// import chatRoutes from './routes/chat.routes.js'
// import pointsRoutes from './routes/points.routes.js'
// import arRoutes from './routes/ar.routes.js'

// Register routes
// app.use('/api/auth', authRoutes)
// app.use('/api/posts', postsRoutes)
// app.use('/api/events', eventsRoutes)
// app.use('/api/missions', missionsRoutes)
// app.use('/api/solar', solarRoutes)
// app.use('/api/satellites', satelliteRoutes)
// app.use('/api/chat', chatRoutes)
// app.use('/api/points', pointsRoutes)
// app.use('/api/ar', arRoutes)

/**
 * HEALTH CHECK ENDPOINT
 * Simple endpoint to verify server is running
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AstroView Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

/**
 * 404 Handler
 * Catches any undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist. Check the API documentation.',
  })
})

/**
 * ERROR HANDLER
 * Global error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('[Error]', err.message)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  })
})

/**
 * DATABASE CONNECTION
 * TODO: Implement MongoDB connection via config/db.js
 */
// import { connectDB } from './config/db.js'
// connectDB()

/**
 * START SERVER
 */
app.listen(PORT, () => {
  console.log(`🚀 AstroView Backend Server running on http://localhost:${PORT}`)
  console.log(`📡 API Documentation: http://localhost:${PORT}/api/docs`)
  console.log(`✅ CORS enabled for http://localhost:3000`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
})
