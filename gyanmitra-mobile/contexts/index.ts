// types/index.ts

/**
 * User object returned by API
 */
export interface User {
    id: string;
    name: string;
    email: string;
    grade: number;
    preferredLanguage: string;
    subjects: string[];
    verified: boolean;
    role: string;
    hasPassword: boolean;
    providers: any[];
    createdAt: string;
    lastLoginAt?: string;
  }
  
  /**
   * Auth response from register/login
   */
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  /**
   * Register request data
   */
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    grade: number;
    preferredLanguage: string;
    subjects: string[];
  }
  
  /**
   * Login request data
   */
  export interface LoginData {
    email: string;
    password: string;
  }
  
  /**
   * Update profile data (all optional)
   */
  export interface UpdateProfileData {
    name?: string;
    grade?: number;
    preferredLanguage?: string;
    subjects?: string[];
  }
  
  /**
   * API Success Response
   */
  export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
  }
  
  /**
   * API Error Response
   */
  export interface ApiErrorResponse {
    success: false;
    error: string;
    message?: string;
  }
  
  /**
   * Message in conversation
   */
  export interface Message {
    role: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
    timestamp: string;
    metadata?: {
      language?: string;
      inScope?: boolean;
      latency?: number;
      modelUsed?: string;
    };
  }
  
  /**
   * Citation from AI response
   */
  export interface Citation {
    number: number;
    source: string;
    chapter?: string;
    page?: number;
    excerpt?: string;
    chunkId?: string;
  }
  
  /**
   * Conversation object
   */
  export interface Conversation {
    id: string;
    title: string;
    metadata: {
      grade: number;
      subject: string;
      language: string;
    };
    messages?: Message[];
    messageCount: number;
    lastMessage?: {
      content: string;
      timestamp: string;
    };
    status: 'active' | 'archived';
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * Query request to AI
   */
  export interface QueryRequest {
    query: string;
    grade: number;
    subject: string;
    language?: string;
    conversationId?: string;
  }
  
  /**
   * Query response from AI
   */
  export interface QueryResponse {
    success: true;
    conversationId: string;
    isNewConversation: boolean;
    answer: string;
    citations: Citation[];
    language: string;
    inScope: boolean;
    metadata: {
      latency: number;
      messageCount: number;
      modelUsed?: string;
    };
  }
  
  /**
   * Feedback data
   */
  export interface FeedbackData {
    conversationId: string;
    messageIndex: number;
    rating: 'positive' | 'negative';
    comment?: string;
  }
  