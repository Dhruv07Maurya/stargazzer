/**
 * Points Model
 * 
 * Tracks user gamification points and achievements
 * 
 * TODO:
 * - Implement achievement unlock logic
 * - Create badge system
 * - Build leaderboard queries
 */

import mongoose from 'mongoose'

const pointsSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  // Points Breakdown
  totalPoints: {
    type: Number,
    default: 0,
  },
  observation Points: {
    type: Number,
    default: 0,
  },
  postPoints: {
    type: Number,
    default: 0,
  },
  commentPoints: {
    type: Number,
    default: 0,
  },
  challengePoints: {
    type: Number,
    default: 0,
  },
  communityPoints: {
    type: Number,
    default: 0,
  },

  // Achievements
  achievements: [
    {
      name: String,
      description: String,
      dateEarned: Date,
      icon: String,
    },
  ],
  badges: [
    {
      name: String,
      level: String, // Bronze, Silver, Gold, Platinum
      icon: String,
      requirement: Number,
    },
  ],

  // Activity Streak
  currentStreak: {
    type: Number,
    default: 0,
  },
  bestStreak: {
    type: Number,
    default: 0,
  },
  lastActivityDate: Date,

  // Rankings
  globalRank: Number,
  monthlyRank: Number,
  weeklyRank: Number,

  // Level
  level: {
    type: Number,
    default: 1,
  },
  experience: {
    type: Number,
    default: 0,
  },
  nextLevelExperience: {
    type: Number,
    default: 100,
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for leaderboard queries
pointsSchema.index({ totalPoints: -1 })
pointsSchema.index({ globalRank: 1 })
pointsSchema.index({ updatedAt: -1 })

export default mongoose.model('Points', pointsSchema)
