// src/models/Conversation.js
const mongoose = require('mongoose');

const citationSchema = new mongoose.Schema(
  {
    number: { 
      type: Number, 
      required: true 
    },
    source: { 
      type: String, 
      required: true 
    }, // e.g., "NCERT Grade 8 Science"
    chapter: String,
    page: Number,
    excerpt: String, // First ~200 chars from source
    chunkId: String  // Reference to vector DB chunk
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant'],
      lowercase: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    citations: [citationSchema],
    timestamp: {
      type: Date,
      default: Date.now
    },
    // Additional metadata for AI responses
    metadata: {
      language: String,
      inScope: Boolean,
      latency: Number, // Response time in milliseconds
      modelUsed: String // e.g., "gemini-1.5-flash"
    }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    
    messages: {
      type: [messageSchema],
      default: []
    },

    // Context for the conversation
    metadata: {
      grade: {
        type: Number,
        required: true,
        min: 5,
        max: 10
      },
      subject: {
        type: String,
        required: true,
        lowercase: true
      },
      language: {
        type: String,
        required: true,
        lowercase: true
      }
    },

    // Conversation title (auto-generated from first message)
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
      maxlength: 100
    },

    // Track if conversation is active or archived
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active'
    }
  },
  { 
    timestamps: true  // createdAt, updatedAt
  }
);

/* ---------- Indexes ---------- */
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ userId: 1, status: 1 });
conversationSchema.index({ 'metadata.grade': 1, 'metadata.subject': 1 });

/* ---------- Instance Methods ---------- */

/**
 * Add a message to the conversation
 * @param {Object} message - Message object
 */
conversationSchema.methods.addMessage = function(message) {
  this.messages.push(message);
  
  // Auto-generate title from first user message
  if (this.messages.length === 1 && message.role === 'user') {
    this.title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
  }
};

/**
 * Get message count
 * @returns {number}
 */
conversationSchema.methods.getMessageCount = function() {
  return this.messages.length;
};

/**
 * Get last message
 * @returns {Object|null}
 */
conversationSchema.methods.getLastMessage = function() {
  return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
};

/**
 * Get conversation preview (for history list)
 * @returns {Object}
 */
conversationSchema.methods.toPreview = function() {
  const lastMessage = this.getLastMessage();
  return {
    id: this._id,
    title: this.title,
    metadata: this.metadata,
    messageCount: this.getMessageCount(),
    lastMessage: lastMessage ? {
      content: lastMessage.content.substring(0, 100),
      timestamp: lastMessage.timestamp
    } : null,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

/* ---------- Static Methods ---------- */

/**
 * Get user's recent conversations
 * @param {ObjectId} userId 
 * @param {number} limit 
 * @returns {Promise<Array>}
 */
conversationSchema.statics.getRecentByUser = function(userId, limit = 10) {
  return this.find({ userId, status: 'active' })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .exec();
};

/* ---------- Model Export ---------- */
const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
