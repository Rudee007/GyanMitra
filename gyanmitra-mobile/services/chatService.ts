// services/chatService.ts
import api from './api';
import type {
  QueryRequest,
  QueryResponse,
  HealthResponse,
  ApiSuccessResponse,
} from '../types';

/**
 * Chat Service
 * Handles query submission and health checks
 */

/**
 * Submit a query to the AI service
 * @param data - Query request data
 * @returns Promise with query response
 */
export const submitQuery = async (data: QueryRequest): Promise<QueryResponse> => {
  try {
    // Validate query
    const validationError = validateQuery(data);
    if (validationError) {
      throw new Error(validationError);
    }

    console.log('💬 Submitting query:', data.query.substring(0, 50) + '...');

    const response = await api.post<QueryResponse>('/query', data);

    console.log('✅ Query submitted successfully');
    console.log('📊 In scope:', response.data.inScope);
    console.log('🔗 Conversation ID:', response.data.conversationId);

    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to submit query:', error.message);
    throw error;
  }
};

/**
 * Check AI service health
 * @returns Promise with health status
 */
export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    console.log('🏥 Checking AI service health...');

    const response = await api.get<HealthResponse>('/query/health');

    console.log('✅ Health check:', response.data.status);

    return response.data;
  } catch (error: any) {
    console.error('❌ Health check failed:', error.message);
    throw error;
  }
};

/**
 * Validate query data
 * @param data - Query data to validate
 * @returns Error message or null if valid
 */
export const validateQuery = (data: QueryRequest): string | null => {
  // Check query text
  if (!data.query || data.query.trim().length === 0) {
    return 'Query cannot be empty';
  }

  if (data.query.length > 500) {
    return 'Query must be 500 characters or less';
  }

  if (data.query.trim().length < 3) {
    return 'Query must be at least 3 characters';
  }

  // Check grade
  if (!data.grade || data.grade < 5 || data.grade > 10) {
    return 'Grade must be between 5 and 10';
  }

  // Check subject
  const validSubjects = ['math', 'science', 'social_science', 'english', 'hindi', 'sanskrit'];
  if (!data.subject || !validSubjects.includes(data.subject.toLowerCase())) {
    return 'Invalid subject selected';
  }

  // Language is optional, will be auto-detected

  return null; // All validations passed
};

const chatService = {
  submitQuery,
  checkHealth,
  validateQuery,
};

export default chatService;
