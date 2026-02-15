/**
 * User Model
 * 
 * Stores user account information and profile data
 * 
 * TODO:
 * - Add password hashing middleware
 * - Implement email verification
 * - Add role-based access control
 * - Track preferences and settings
 */

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  // Profile
  role: {
    type: String,
    enum: ['enthusiast', 'researcher', 'student', 'professional'],
    default: 'enthusiast',
  },
  location: {
    type: String,
    default: null,
  },
  latitude: Number,
  longitude: Number,
  timezone: String,

  // Preferences
  notifications: {
    email: { type: Boolean, default: true },
    events: { type: Boolean, default: true },
    digest: { type: Boolean, default: true },
  },
  publicProfile: {
    type: Boolean,
    default: false,
  },

  // Stats
  points: {
    type: Number,
    default: 0,
  },
  followers: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
  observations: {
    type: Number,
    default: 0,
  },
  posts: {
    type: Number,
    default: 0,
  },

  // Account Status
  emailVerified: {
    type: Boolean,
    default: false,
  },
  accountActive: {
    type: Boolean,
    default: true,
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
  lastLogin: Date,
})

// Index for faster queries
userSchema.index({ email: 1 })
userSchema.index({ createdAt: -1 })

export default mongoose.model('User', userSchema)
