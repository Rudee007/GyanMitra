// services/feedbackService.ts
import api from './api';
import type { FeedbackRequest, FeedbackResponse, ApiSuccessResponse } from '../types';

/**
 * Feedback Service
 * Handles user feedback submission
 */

/**
 * Submit feedback for an AI response
 * @param data - Feedback data
 * @returns Promise with feedback response
 */
export const submitFeedback = async (data: FeedbackRequest): Promise<FeedbackResponse> => {
  try {
    // Validate feedback
    const validationError = validateFeedback(data);
    if (validationError) {
      throw new Error(validationError);
    }

    console.log('👍 Submitting feedback:', data.rating);

    const response = await api.post<FeedbackResponse>('/feedback', data);

    console.log('✅ Feedback submitted successfully');

    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to submit feedback:', error.message);
    throw error;
  }
};

/**
 * Validate feedback data
 * @param data - Feedback data to validate
 * @returns Error message or null if valid
 */
export const validateFeedback = (data: FeedbackRequest): string | null => {
  // Check conversationId
  if (!data.conversationId || data.conversationId.trim().length === 0) {
    return 'Conversation ID is required';
  }

  // Check messageIndex
  if (data.messageIndex === undefined || data.messageIndex < 0) {
    return 'Valid message index is required';
  }

  // Check rating
  if (!data.rating || !['positive', 'negative'].includes(data.rating)) {
    return 'Rating must be either "positive" or "negative"';
  }

  // Check comment length (optional)
  if (data.comment && data.comment.length > 500) {
    return 'Comment must be 500 characters or less';
  }

  return null; // All validations passed
};

const feedbackService = {
  submitFeedback,
  validateFeedback,
};

export default feedbackService;
