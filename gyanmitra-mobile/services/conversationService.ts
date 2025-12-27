// services/conversationService.ts
import api from './api';
import type {
  Conversation,
  ConversationListResponse,
  ConversationDetailResponse,
  ApiSuccessResponse,
} from '../types';

/**
 * Conversation Service
 * Handles conversation history management
 */

/**
 * Get list of conversations with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param filters - Optional filters (status, subject, grade)
 * @returns Promise with conversations list
 */
export const getConversations = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: 'active' | 'archived';
    subject?: string;
    grade?: number;
  }
): Promise<ConversationListResponse> => {
  try {
    console.log('📜 Fetching conversations...', { page, limit, filters });

    // Build query params
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.subject) {
      params.append('subject', filters.subject);
    }
    if (filters?.grade) {
      params.append('grade', filters.grade.toString());
    }

    const response = await api.get<ConversationListResponse>(
      `/conversation?${params.toString()}`
    );

    console.log('✅ Conversations fetched:', response.data.data.length);

    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch conversations:', error.message);
    throw error;
  }
};

/**
 * Get conversation by ID with full message history
 * @param id - Conversation ID
 * @returns Promise with conversation details
 */
export const getConversationById = async (id: string): Promise<Conversation> => {
  try {
    console.log('📖 Fetching conversation:', id);

    const response = await api.get<ConversationDetailResponse>(`/conversation/${id}`);

    console.log('✅ Conversation fetched');

    return response.data.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch conversation:', error.message);
    throw error;
  }
};

/**
 * Delete (archive) a conversation
 * @param id - Conversation ID
 * @returns Promise with success status
 */
export const deleteConversation = async (id: string): Promise<void> => {
  try {
    console.log('🗑️ Deleting conversation:', id);

    await api.delete(`/conversation/${id}`);

    console.log('✅ Conversation deleted');
  } catch (error: any) {
    console.error('❌ Failed to delete conversation:', error.message);
    throw error;
  }
};

/**
 * Restore an archived conversation
 * @param id - Conversation ID
 * @returns Promise with success status
 */
export const restoreConversation = async (id: string): Promise<void> => {
  try {
    console.log('♻️ Restoring conversation:', id);

    await api.put(`/conversation/${id}/restore`);

    console.log('✅ Conversation restored');
  } catch (error: any) {
    console.error('❌ Failed to restore conversation:', error.message);
    throw error;
  }
};

const conversationService = {
  getConversations,
  getConversationById,
  deleteConversation,
  restoreConversation,
};

export default conversationService;
