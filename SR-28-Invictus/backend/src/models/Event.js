/**
 * Event Model
 * 
 * Stores astronomical events from NASA, NOAA, and other sources
 * 
 * TODO:
 * - Implement event filtering
 * - Add location-based visibility
 * - Track user subscriptions to events
 */

import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  // Event Details
  title: {
    type: String,
    required: true,
  },
  description: String,
  eventType: {
    type: String,
    enum: [
      'Meteor Shower',
      'Solar Flare',
      'Lunar Eclipse',
      'Solar Eclipse',
      'Planetary Conjunction',
      'Supernova',
      'Aurora',
      'Comets',
      'Asteroids',
      'Other',
    ],
  },

  // Timing
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  peakTime: Date,
  duration: String,

  // Location/Visibility
  visibility: [String], // Regions where visible
  bestViewingLocation: String,
  latitude: Number,
  longitude: Number,
  magnitude: Number, // Brightness

  // Details
  meteorPerHour: Number, // For meteor showers
  zenithalRate: Number,
  radiantPoint: String,

  // Source
  source: {
    type: String,
    enum: ['NASA', 'NOAA', 'ESA', 'JAXA', 'User', 'Community'],
    default: 'NASA',
  },
  sourceUrl: String,
  externalId: String,

  // Engagement
  interested: {
    type: Number,
    default: 0,
  },
  interestedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  // Metadata
  published: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  notifyBefore: Number, // Hours before event
})

// Index for faster queries
eventSchema.index({ startTime: 1 })
eventSchema.index({ eventType: 1 })
eventSchema.index({ startTime: 1, visibility: 1 })

export default mongoose.model('Event', eventSchema)
