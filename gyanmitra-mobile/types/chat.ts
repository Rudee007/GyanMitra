// types/chat.ts

/**
 * Chat-related TypeScript interfaces
 * Based on GyanMitra API Documentation v1.0.0
 */

// Query Request & Response
export interface QueryRequest {
    query: string;
    grade: number;
    subject: string;
    language?: string;
    conversationId?: string;
  }
  
  export interface Citation {
    number: number;
    source: string;
    chapter: string;
    page: number;
    excerpt: string;
    chunkId: string;
  }
  
  export interface QueryMetadata {
    latency: number;
    messageCount: number;
    modelUsed: string;
  }
  
  export interface QueryResponse {
    success: boolean;
    conversationId: string;
    isNewConversation: boolean;
    answer: string;
    citations: Citation[];
    language: string;
    inScope: boolean;
    metadata: QueryMetadata;
  }
  
  // Health Check
  export interface HealthResponse {
    status: 'ok' | 'error';
    mode: 'mock' | 'production';
    timestamp: string;
  }
  
  // Conversation Types
  export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
    citations: Citation[];
    timestamp: string;
    feedbackGiven?: boolean; // ← ADDED: Track if feedback was given
    feedbackType?: 'positive' | 'negative'; // ← ADDED: Store feedback type
    metadata?: {
      language: string;
      inScope: boolean;
      latency: number;
      modelUsed: string;
    };
  }
  
  export interface ConversationMetadata {
    grade: number;
    subject: string;
    language: string;
  }
  
  export interface Conversation {
    id: string;
    title: string;
    metadata: ConversationMetadata;
    messages?: ConversationMessage[];
    messageCount: number;
    lastMessage?: {
      content: string;
      timestamp: string;
    };
    status: 'active' | 'archived';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ConversationListResponse {
    success: boolean;
    data: Conversation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  }
  
  export interface ConversationDetailResponse {
    success: boolean;
    data: Conversation;
  }
  
  // Feedback Types
  export interface FeedbackRequest {
    conversationId: string;
    messageIndex: number;
    rating: 'positive' | 'negative';
    comment?: string;
  }
  
  export interface FeedbackResponse {
    success: boolean;
    message: string;
    data: {
      id: string;
      rating: 'positive' | 'negative';
      comment?: string;
      timestamp: string;
    };
  }
  
  // Valid values
  export const VALID_SUBJECTS = ['math', 'science', 'social_science', 'english', 'hindi', 'sanskrit'] as const;
  export const VALID_LANGUAGES = ['english', 'hindi', 'marathi', 'urdu'] as const;
  export const VALID_GRADES = [5, 6, 7, 8, 9, 10] as const;
  
  export type ValidSubject = typeof VALID_SUBJECTS[number];
  export type ValidLanguage = typeof VALID_LANGUAGES[number];
  export type ValidGrade = typeof VALID_GRADES[number];
  