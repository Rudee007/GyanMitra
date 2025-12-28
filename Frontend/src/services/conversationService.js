/**
 * Conversation Service
 * Handles all API calls related to conversation management
 * Matches backend response structure exactly
 */

import axiosInstance from '../lib/axiosInstance';

const conversationService = {
  /**
   * Get list of conversations with pagination
   * GET /api/conversations?page=1&limit=10
   */
  getConversations: async (page = 1, limit = 10) => {
    try {
      console.log('📚 Fetching conversations...');

      const response = await axiosInstance.get('/conversation', {
        params: { page, limit }
      });

      // Backend returns: { success, data, pagination }
      const conversations = response.data.data || [];
      const pagination = response.data.pagination || {};

      console.log(`✅ Fetched ${conversations.length} conversations`);

      return {
        success: true,
        conversations: conversations.map(conv => ({
          id: conv.id || conv._id,
          title: conv.title || 'Untitled Chat',
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          messageCount: conv.messageCount || 0,
          metadata: conv.metadata || {},
          status: conv.status || 'active'
        })),
        pagination: {
          page: pagination.page || page,
          limit: pagination.limit || limit,
          total: pagination.total || 0,
          totalPages: pagination.totalPages || 0,
          hasMore: pagination.hasMore || false
        }
      };
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);

      return {
        success: false,
        conversations: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasMore: false
        },
        error: {
          message: error.message || 'Failed to fetch conversations',
          code: error.status || 500
        }
      };
    }
  },

  /**
   * Get a specific conversation by ID with all messages
   * GET /api/conversations/:id
   */
  getConversationById: async (id) => {
    try {
      if (!id) {
        throw new Error('Conversation ID is required');
      }

      console.log(`📖 Fetching conversation ${id}...`);

      const response = await axiosInstance.get(`/conversation/${id}`);

      // Backend returns: { success, data: { id, title, metadata, messages, ... } }
      const data = response.data.data;

      console.log('✅ Conversation fetched');

      return {
        success: true,
        conversation: {
          id: data.id || data._id,
          title: data.title || 'Untitled Chat',
          metadata: data.metadata || {},
          messages: data.messages || [],
          status: data.status || 'active',
          messageCount: data.messageCount || 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        }
      };
    } catch (error) {
      console.error(`❌ Error fetching conversation ${id}:`, error);

      return {
        success: false,
        conversation: null,
        error: {
          message: error.message || 'Failed to fetch conversation',
          code: error.status || 500
        }
      };
    }
  },

  /**
   * Delete a conversation (soft delete - archives it)
   * DELETE /api/conversations/:id
   */
  deleteConversation: async (id) => {
    try {
      if (!id) {
        throw new Error('Conversation ID is required');
      }

      console.log(`🗑️ Deleting conversation ${id}...`);

      const response = await axiosInstance.delete(`/conversation/${id}`);

      console.log('✅ Conversation deleted');

      return {
        success: true,
        message: response.data.message || 'Conversation archived successfully',
        deletedId: id
      };
    } catch (error) {
      console.error(`❌ Error deleting conversation ${id}:`, error);

      return {
        success: false,
        error: {
          message: error.message || 'Failed to delete conversation',
          code: error.status || 500
        }
      };
    }
  },

  /**
   * Restore an archived conversation
   * PUT /api/conversations/:id/restore
   */
  restoreConversation: async (id) => {
    try {
      if (!id) {
        throw new Error('Conversation ID is required');
      }

      console.log(`♻️ Restoring conversation ${id}...`);

      const response = await axiosInstance.put(`/conversation/${id}/restore`);

      console.log('✅ Conversation restored');

      return {
        success: true,
        message: response.data.message || 'Conversation restored successfully',
        conversation: response.data.data
      };
    } catch (error) {
      console.error(`❌ Error restoring conversation ${id}:`, error);

      return {
        success: false,
        error: {
          message: error.message || 'Failed to restore conversation',
          code: error.status || 500
        }
      };
    }
  },

  /**
   * Group conversations by date (Today, Yesterday, Last 7 Days, Older)
   */
  groupConversationsByDate: (conversations) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const grouped = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: []
    };

    conversations.forEach(conversation => {
      const conversationDate = new Date(conversation.updatedAt || conversation.createdAt);
      const conversationDay = new Date(
        conversationDate.getFullYear(),
        conversationDate.getMonth(),
        conversationDate.getDate()
      );

      if (conversationDay.getTime() === today.getTime()) {
        grouped.today.push(conversation);
      } else if (conversationDay.getTime() === yesterday.getTime()) {
        grouped.yesterday.push(conversation);
      } else if (conversationDate >= lastWeek) {
        grouped.lastWeek.push(conversation);
      } else {
        grouped.older.push(conversation);
      }
    });

    return grouped;
  },

  /**
   * Format conversation for display
   */
  formatConversation: (conversation) => {
    return {
      ...conversation,
      displayTitle: conversation.title?.length > 50 
        ? conversation.title.substring(0, 50) + '...' 
        : conversation.title || 'Untitled Chat',
      relativeTime: getRelativeTime(conversation.updatedAt || conversation.createdAt)
    };
  },
};

/**
 * Helper: Get relative time string (e.g., "2 hours ago", "Yesterday")
 */
const getRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return then.toLocaleDateString();
};

export default conversationService;

// Named exports for convenience
export const {
  getConversations,
  getConversationById,
  deleteConversation,
  restoreConversation,
  groupConversationsByDate,
  formatConversation
} = conversationService;
