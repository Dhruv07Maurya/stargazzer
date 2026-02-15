/**
 * Post Model
 * 
 * Stores community posts and space event updates
 * 
 * TODO:
 * - Implement comment system
 * - Add media attachment support
 * - Track engagement metrics
 */

import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  // Content
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
  },
  content: String,
  category: {
    type: String,
    enum: [
      'Space Event',
      'Astronomy',
      'Space Mission',
      'Climate Impact',
      'Discovery',
      'Astrophotography',
      'Guide',
      'Discussion',
    ],
    default: 'Discovery',
  },

  // Author
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: String,

  // Media
  image: String,
  imageUrl: String,
  media: [String],

  // Engagement
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: {
    type: Number,
    default: 0,
  },
  shares: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },

  // Metadata
  published: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tags: [String],
  source: String, // NASA, community, etc.
})

// Index for faster queries
postSchema.index({ authorId: 1, createdAt: -1 })
postSchema.index({ category: 1 })
postSchema.index({ createdAt: -1 })
postSchema.index({ likes: -1 })

export default mongoose.model('Post', postSchema)
