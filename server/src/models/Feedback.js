// src/models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },

    messageIndex: {
      type: Number,
      required: true,
      min: 0
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    rating: {
      type: String,
      required: true,
      enum: ['positive', 'negative'],
      lowercase: true
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500
    },

    // Additional context
    context: {
      query: String,        // Original question
      subject: String,      // Subject context
      grade: Number,        // Grade level
      language: String      // Language used
    },

    timestamp: {
      type: Date,
      default: Date.now
    },

    // Track if feedback has been reviewed by admin
    reviewed: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

/* ---------- Indexes ---------- */
feedbackSchema.index({ conversationId: 1, messageIndex: 1 });
feedbackSchema.index({ userId: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ timestamp: -1 });
feedbackSchema.index({ reviewed: 1 });

/* ---------- Prevent duplicate feedback ---------- */
// Compound unique index to prevent user from giving feedback twice on same message
feedbackSchema.index({ conversationId: 1, messageIndex: 1, userId: 1 }, { unique: true });

/* ---------- Static Methods ---------- */

/**
 * Get feedback statistics
 * @param {Object} filters - Optional filters (date range, subject, etc.)
 * @returns {Promise<Object>}
 */
feedbackSchema.statics.getStats = async function(filters = {}) {
  const match = {};
  
  if (filters.startDate || filters.endDate) {
    match.timestamp = {};
    if (filters.startDate) match.timestamp.$gte = new Date(filters.startDate);
    if (filters.endDate) match.timestamp.$lte = new Date(filters.endDate);
  }
  
  if (filters.subject) match['context.subject'] = filters.subject;
  if (filters.grade) match['context.grade'] = filters.grade;

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = stats.reduce((sum, item) => sum + item.count, 0);
  const positive = stats.find(s => s._id === 'positive')?.count || 0;
  const negative = stats.find(s => s._id === 'negative')?.count || 0;

  return {
    total,
    positive,
    negative,
    positiveRate: total > 0 ? ((positive / total) * 100).toFixed(2) : 0
  };
};

/**
 * Get recent negative feedback (for improvement)
 * @param {number} limit 
 * @returns {Promise<Array>}
 */
feedbackSchema.statics.getRecentNegative = function(limit = 20) {
  return this.find({ rating: 'negative', reviewed: false })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .populate('conversationId')
    .exec();
};

/* ---------- Model Export ---------- */
const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
