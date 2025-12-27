// src/controllers/conversationController.js
const Conversation = require('../models/Conversation');

/**
 * Get list of user's conversations (paginated)
 */
async function getConversations(req, res) {
  try {
    const userId = req.userId; // from auth middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'active';
    
    // Optional filters
    const filters = {
      userId,
      status
    };

    if (req.query.subject) {
      filters['metadata.subject'] = req.query.subject.toLowerCase();
    }

    if (req.query.grade) {
      filters['metadata.grade'] = parseInt(req.query.grade);
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get conversations with pagination
    const conversations = await Conversation.find(filters)
      .sort({ updatedAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .select('title metadata messages createdAt updatedAt status') // Don't send full message content
      .exec();

    // Get total count for pagination
    const total = await Conversation.countDocuments(filters);

    // Transform to preview format
    const conversationPreviews = conversations.map(conv => conv.toPreview());

    res.json({
      success: true,
      data: conversationPreviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + conversations.length < total
      }
    });

  } catch (error) {
    console.error('[Conversation] Get list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations',
      message: error.message
    });
  }
}

/**
 * Get specific conversation by ID
 */
async function getConversationById(req, res) {
  try {
    const userId = req.userId;
    const conversationId = req.params.id;

    // Validate ObjectId
    if (!conversationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }

    // Find conversation
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

    res.json({
      success: true,
      data: {
        id: conversation._id,
        title: conversation.title,
        metadata: conversation.metadata,
        messages: conversation.messages,
        status: conversation.status,
        messageCount: conversation.getMessageCount(),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
    });

  } catch (error) {
    console.error('[Conversation] Get by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation',
      message: error.message
    });
  }
}

/**
 * Delete conversation (soft delete - mark as archived)
 */
async function deleteConversation(req, res) {
  try {
    const userId = req.userId;
    const conversationId = req.params.id;

    // Validate ObjectId
    if (!conversationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation ID'
      });
    }

    // Find and update conversation
    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        userId: userId
      },
      {
        status: 'archived'
      },
      {
        new: true
      }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found or you do not have access'
      });
    }

    res.json({
      success: true,
      message: 'Conversation archived successfully',
      data: {
        id: conversation._id,
        status: conversation.status
      }
    });

  } catch (error) {
    console.error('[Conversation] Delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete conversation',
      message: error.message
    });
  }
}

/**
 * Restore archived conversation
 */
async function restoreConversation(req, res) {
  try {
    const userId = req.userId;
    const conversationId = req.params.id;

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        userId: userId
      },
      {
        status: 'active'
      },
      {
        new: true
      }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      message: 'Conversation restored successfully',
      data: {
        id: conversation._id,
        status: conversation.status
      }
    });

  } catch (error) {
    console.error('[Conversation] Restore error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore conversation',
      message: error.message
    });
  }
}

module.exports = {
  getConversations,
  getConversationById,
  deleteConversation,
  restoreConversation
};
