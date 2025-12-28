/**
 * Feedback Service
 * Handles all API calls related to user feedback
 */

import axiosInstance from '../lib/axiosInstance';

const feedbackService = {
  /**
   * Submit feedback for an AI response
   * POST /api/feedback
   */
  submitFeedback: async (conversationId, messageIndex, rating, comment = null) => {
    try {
      // Validate required parameters
      if (!conversationId || messageIndex === undefined || !rating) {
        throw new Error('conversationId, messageIndex, and rating are required');
      }

      // ✅ Normalize rating to backend format
      let normalizedRating = rating;
      if (rating === 'thumbs_up') normalizedRating = 'positive';
      if (rating === 'thumbs_down') normalizedRating = 'negative';

      // Validate rating value (backend only accepts 'positive' or 'negative')
      if (!['positive', 'negative'].includes(normalizedRating)) {
        throw new Error('Rating must be "positive" or "negative"');
      }

      console.log('👍 Submitting feedback:', {
        conversationId,
        messageIndex,
        rating: normalizedRating,
        comment
      });

      // ✅ Send exactly what backend expects
      const response = await axiosInstance.post('/feedback', {
        conversationId,
        messageIndex,
        rating: normalizedRating,
        comment: comment || null
      });

      console.log('✅ Feedback submitted:', response.data);

      return {
        success: true,
        message: response.data.message || 'Feedback submitted successfully',
        feedbackId: response.data.data?.id || response.data.id
      };
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);

      // Handle duplicate feedback error (409)
      if (error.status === 409) {
        return {
          success: false,
          duplicate: true,
          error: {
            message: 'You have already provided feedback for this message',
            code: 409
          }
        };
      }

      return {
        success: false,
        error: {
          message: error.message || 'Failed to submit feedback',
          code: error.status || 500
        }
      };
    }
  },

  /**
   * Get user's feedback history
   * GET /api/feedback/my-feedback
   */
  getMyFeedback: async (page = 1, limit = 20, rating = null) => {
    try {
      const params = { page, limit };
      if (rating) {
        params.rating = rating;
      }

      const response = await axiosInstance.get('/feedback/my-feedback', { params });

      return {
        success: true,
        feedbacks: response.data.data || [],
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      console.error('Error fetching feedback:', error);

      return {
        success: false,
        feedbacks: [],
        error: {
          message: error.message || 'Failed to fetch feedback',
          code: error.status || 500
        }
      };
    }
  },

  /**
   * Update feedback
   * PUT /api/feedback/:id
   */
  updateFeedback: async (feedbackId, rating, comment = null) => {
    try {
      if (!feedbackId) {
        throw new Error('feedbackId is required');
      }

      const response = await axiosInstance.put(`/feedback/${feedbackId}`, {
        rating,
        comment
      });

      return {
        success: true,
        message: response.data.message || 'Feedback updated successfully'
      };
    } catch (error) {
      console.error('Error updating feedback:', error);

      return {
        success: false,
        error: {
          message: error.message || 'Failed to update feedback',
          code: error.status || 500
        }
      };
    }
  },

  /**
   * Delete feedback
   * DELETE /api/feedback/:id
   */
  deleteFeedback: async (feedbackId) => {
    try {
      if (!feedbackId) {
        throw new Error('feedbackId is required');
      }

      const response = await axiosInstance.delete(`/feedback/${feedbackId}`);

      return {
        success: true,
        message: response.data.message || 'Feedback deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting feedback:', error);

      return {
        success: false,
        error: {
          message: error.message || 'Failed to delete feedback',
          code: error.status || 500
        }
      };
    }
  },

  /**
   * Check if feedback has been given for a specific message
   * Uses localStorage to track feedback state
   */
  getFeedbackState: (conversationId, messageIndex) => {
    try {
      const feedbackKey = `feedback_${conversationId}_${messageIndex}`;
      const storedFeedback = localStorage.getItem(feedbackKey);

      if (storedFeedback) {
        return JSON.parse(storedFeedback);
      }

      return null;
    } catch (error) {
      console.error('Error getting feedback state:', error);
      return null;
    }
  },

  /**
   * Store feedback state in localStorage
   */
  storeFeedbackState: (conversationId, messageIndex, rating, comment = null) => {
    try {
      const feedbackKey = `feedback_${conversationId}_${messageIndex}`;
      const feedbackData = {
        rating,
        comment,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(feedbackKey, JSON.stringify(feedbackData));
    } catch (error) {
      console.error('Error storing feedback state:', error);
    }
  },

  /**
   * Clear feedback state for a conversation
   */
  clearFeedbackState: (conversationId) => {
    try {
      const keys = Object.keys(localStorage);
      const feedbackKeys = keys.filter(key => key.startsWith(`feedback_${conversationId}_`));

      feedbackKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing feedback state:', error);
    }
  },

  /**
   * Get feedback statistics
   */
  getFeedbackStatistics: () => {
    try {
      const keys = Object.keys(localStorage);
      const feedbackKeys = keys.filter(key => key.startsWith('feedback_'));

      let positive = 0;
      let negative = 0;

      feedbackKeys.forEach(key => {
        try {
          const feedback = JSON.parse(localStorage.getItem(key));
          if (feedback.rating === 'positive') {
            positive++;
          } else if (feedback.rating === 'negative') {
            negative++;
          }
        } catch (e) {
          // Skip invalid entries
        }
      });

      return {
        total: feedbackKeys.length,
        positive,
        negative,
        positivePercentage: feedbackKeys.length > 0
          ? Math.round((positive / feedbackKeys.length) * 100)
          : 0
      };
    } catch (error) {
      console.error('Error getting feedback statistics:', error);
      return {
        total: 0,
        positive: 0,
        negative: 0,
        positivePercentage: 0
      };
    }
  }
};

export default feedbackService;

// Named exports for convenience
export const {
  submitFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackState,
  storeFeedbackState,
  clearFeedbackState,
  getFeedbackStatistics
} = feedbackService;
