/**
 * MongoDB Connection Configuration
 * 
 * This file handles the connection to MongoDB.
 * Currently a placeholder - real implementation will connect to MongoDB Atlas or local instance.
 * 
 * TODO: 
 * - Set up MongoDB connection string in .env
 * - Implement connection pooling
 * - Add error handling and retry logic
 */

import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/astroview'

    console.log('🔄 Connecting to MongoDB...')

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('✅ MongoDB connected successfully')

    return mongoose.connection
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
