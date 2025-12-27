// src/controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const Conversation = require('../models/Conversation');

/**
 * Submit feedback on an AI response
 * POST /api/feedback
 */
async function submitFeedback(req, res) {
  try {
    const { conversationId, messageIndex, rating, comment } = req.body;
    const userId = req.userId; // from auth middleware

    // ===== Input Validation =====
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'conversationId is required'
      });
    }

    if (messageIndex === undefined || messageIndex === null) {
      return res.status(400).json({
        success: false,
        error: 'messageIndex is required'
      });
    }

    if (typeof messageIndex !== 'number' || messageIndex < 0) {
      return res.status(400).json({
        success: false,
        error: 'messageIndex must be a non-negative number'
      });
    }

    if (!rating || !['positive', 'negative'].includes(rating.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'rating must be either "positive" or "negative"'
      });
    }

    if (comment && comment.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'comment cannot exceed 500 characters'
      });
    }

    // ===== Verify Conversation Exists and User Owns It =====
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found or you do not have access'
      });
    }

    // ===== Verify Message Index Exists =====
    if (messageIndex >= conversation.messages.length) {
      return res.status(400).json({
        success: false,
        error: `Invalid messageIndex. This conversation has ${conversation.messages.length} messages (index 0-${conversation.messages.length - 1})`
      });
    }

    const message = conversation.messages[messageIndex];

    // ===== Only Allow Feedback on AI Messages =====
    if (message.role !== 'assistant') {
      return res.status(400).json({
        success: false,
        error: 'Feedback can only be given on AI responses (assistant messages)'
      });
    }

    // ===== Extract Context from Message and Conversation =====
    const feedbackContext = {
      query: messageIndex > 0 ? conversation.messages[messageIndex - 1]?.content : null,
      subject: conversation.metadata.subject,
      grade: conversation.metadata.grade,
      language: conversation.metadata.language
    };

    // ===== Check for Duplicate Feedback =====
    const existingFeedback = await Feedback.findOne({
      conversationId,
      messageIndex,
      userId
    });

    if (existingFeedback) {
      return res.status(409).json({
        success: false,
        error: 'You have already provided feedback for this message',
        existingFeedback: {
          rating: existingFeedback.rating,
          comment: existingFeedback.comment,
          timestamp: existingFeedback.timestamp
        }
      });
    }

    // ===== Create Feedback =====
    const feedback = new Feedback({
      conversationId,
      messageIndex,
      userId,
      rating: rating.toLowerCase(),
      comment: comment?.trim() || null,
      context: feedbackContext,
      reviewed: false
    });

    await feedback.save();

    console.log(`[Feedback] User ${userId} gave ${rating} feedback on message ${messageIndex} in conversation ${conversationId}`);

    // ===== Return Success =====
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: feedback._id,
        rating: feedback.rating,
        comment: feedback.comment,
        timestamp: feedback.timestamp
      }
    });

  } catch (error) {
    console.error('[Feedback] Submit error:', error);
    
    // Handle duplicate key error (in case unique index catches it)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'You have already provided feedback for this message'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback',
      message: error.message
    });
  }
}

/**
 * Get user's own feedback history
 * GET /api/feedback/my-feedback
 */
async function getMyFeedback(req, res) {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Optional filters
    const filters = { userId };
    
    if (req.query.rating) {
      filters.rating = req.query.rating.toLowerCase();
    }

    // Get feedback with pagination
    const feedbacks = await Feedback.find(filters)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('conversationId', 'title metadata')
      .exec();

    // Get total count
    const total = await Feedback.countDocuments(filters);

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + feedbacks.length < total
      }
    });

  } catch (error) {
    console.error('[Feedback] Get my feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feedback',
      message: error.message
    });
  }
}

/**
 * Update feedback (allow user to change their rating/comment)
 * PUT /api/feedback/:id
 */
async function updateFeedback(req, res) {
  try {
    const feedbackId = req.params.id;
    const userId = req.userId;
    const { rating, comment } = req.body;

    // Validate ObjectId
    if (!feedbackId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid feedback ID'
      });
    }

    // Find feedback
    const feedback = await Feedback.findOne({
      _id: feedbackId,
      userId: userId
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found or you do not have access'
      });
    }

    // Update fields if provided
    if (rating) {
      if (!['positive', 'negative'].includes(rating.toLowerCase())) {
        return res.status(400).json({
          success: false,
          error: 'rating must be either "positive" or "negative"'
        });
      }
      feedback.rating = rating.toLowerCase();
    }

    if (comment !== undefined) {
      if (comment && comment.length > 500) {
        return res.status(400).json({
          success: false,
          error: 'comment cannot exceed 500 characters'
        });
      }
      feedback.comment = comment?.trim() || null;
    }

    await feedback.save();

    console.log(`[Feedback] User ${userId} updated feedback ${feedbackId}`);

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: {
        id: feedback._id,
        rating: feedback.rating,
        comment: feedback.comment,
        timestamp: feedback.timestamp
      }
    });

  } catch (error) {
    console.error('[Feedback] Update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update feedback',
      message: error.message
    });
  }
}

/**
 * Delete feedback
 * DELETE /api/feedback/:id
 */
async function deleteFeedback(req, res) {
  try {
    const feedbackId = req.params.id;
    const userId = req.userId;

    // Validate ObjectId
    if (!feedbackId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid feedback ID'
      });
    }

    // Find and delete
    const feedback = await Feedback.findOneAndDelete({
      _id: feedbackId,
      userId: userId
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found or you do not have access'
      });
    }

    console.log(`[Feedback] User ${userId} deleted feedback ${feedbackId}`);

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    console.error('[Feedback] Delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete feedback',
      message: error.message
    });
  }
}

module.exports = {
  submitFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback
};
