/**
 * Mission Model
 * 
 * Stores space mission data from NASA, ISRO, ESA, etc.
 * 
 * TODO:
 * - Track mission status updates
 * - Store telemetry data
 * - Record crew information
 */

import mongoose from 'mongoose'

const missionSchema = new mongoose.Schema({
  // Mission Info
  name: {
    type: String,
    required: true,
  },
  description: String,
  missionType: {
    type: String,
    enum: ['Crewed', 'Uncrewed', 'Robotic', 'Orbital', 'Lunar', 'Interplanetary', 'Deep Space'],
  },

  // Agency
  agency: {
    type: String,
    enum: ['NASA', 'ISRO', 'ESA', 'SpaceX', 'CNSA', 'Roscosmos', 'JAXA', 'Other'],
  },
  country: String,

  // Timeline
  launchDate: Date,
  launchTime: String,
  launchSite: String,
  landingDate: Date,
  missionDuration: String,
  status: {
    type: String,
    enum: ['Planning', 'Scheduled', 'Active', 'Completed', 'Failed', 'Cancelled'],
    default: 'Planning',
  },

  // Details
  objectives: [String],
  instruments: [String],
  crew: [
    {
      name: String,
      role: String,
      nationality: String,
    },
  ],
  spacecraft: String,
  launchVehicle: String,

  // Destination
  destination: String,
  targetObject: String, // Moon, Mars, etc.
  orbit: String,
  altitude: String,

  // Data
  payload: String,
  weight: String,
  cost: String,

  // Media
  image: String,
  imageUrl: String,
  videoUrl: String,

  // Source
  source: String,
  sourceUrl: String,
  externalId: String,

  // Engagement
  followers: {
    type: Number,
    default: 0,
  },
  followersList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
})

// Index for faster queries
missionSchema.index({ launchDate: 1 })
missionSchema.index({ status: 1 })
missionSchema.index({ agency: 1 })
missionSchema.index({ launchDate: 1, status: 1 })

export default mongoose.model('Mission', missionSchema)
