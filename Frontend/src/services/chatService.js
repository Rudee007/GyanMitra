/**
 * Chat Service - Handles AI query submission and response processing
 * Updated for API v2.0 with citations and sourceChunks
 */

import axiosInstance from '../lib/axiosInstance';

const chatService = {
  /**
   * Send a query to the AI backend
   * POST /api/query/submit
   * 
   * NEW Response Structure (API v2.0):
   * {
   *   success: true,
   *   answer: "...",
   *   citations: [{number, source, chapter, section, page, excerpt, relevance, chunkId}],
   *   sourceChunks: [{chunkId, fullText, page, chapter, relevance}],
   *   metadata: {model, confidence, tokensUsed, chunksRetrieved, processingTime},
   *   conversationId: "...",
   *   isNewConversation: false
   * }
   */
  sendQuery: async (queryText, grade, subject, language, conversationId = null, top_k = 5) => {
    try {
      // Validation
      if (!queryText || !grade || !subject || !language) {
        throw new Error('Missing required parameters');
      }

      console.log('💬 Sending query to AI...');
      console.log(`Query: "${queryText.substring(0, 50)}..." | Grade: ${grade} | Subject: ${subject}`);

      // Match backend field names exactly
      const payload = {
        query: queryText.trim(),
        grade: parseInt(grade),
        subject: subject.toLowerCase(),
        language: language.toLowerCase(),
        top_k: top_k || 5
      };

      // Add conversationId if it's a follow-up
      if (conversationId) {
        payload.conversationId = conversationId;
      }

      console.log('📤 Payload:', payload);

      // Make API call
      const response = await axiosInstance.post('/query', payload);

      console.log('✅ AI response received');
      console.log(`Citations: ${response.data.citations?.length || 0}, Source chunks: ${response.data.sourceChunks?.length || 0}`);

      // ✅ NEW: Extract response data with new structure
      return {
        success: true,
        answer: response.data.answer || '',
        
        // ✅ NEW: Rich citations with excerpts
        citations: response.data.citations?.map(citation => ({
          number: citation.number,
          source: citation.source,
          chapter: citation.chapter,
          section: citation.section,
          page: citation.page,
          excerpt: citation.excerpt,
          relevance: citation.relevance,
          relevancePercent: citation.relevancePercent || Math.round(citation.relevance * 100),
          chunkId: citation.chunkId
        })) || [],
        
        // ✅ NEW: Source chunks for "show more" modal
        sourceChunks: response.data.sourceChunks?.map(chunk => ({
          chunkId: chunk.chunkId,
          fullText: chunk.fullText,
          page: chunk.page,
          chapter: chunk.chapter,
          section: chunk.section,
          tokenCount: chunk.tokenCount,
          relevance: chunk.relevance,
          relevancePercent: chunk.relevancePercent || Math.round(chunk.relevance * 100)
        })) || [],
        
        conversationId: response.data.conversationId || conversationId || generateTempId(),
        isNewConversation: response.data.isNewConversation || false,
        inScope: response.data.inScope !== false,
        language: response.data.language || language,
        
        // ✅ NEW: Enhanced metadata
        metadata: {
          model: response.data.metadata?.model || 'Mistral-7B-Instruct-v0.2',
          confidence: response.data.metadata?.confidence || 0,
          tokensUsed: response.data.metadata?.tokensUsed || 0,
          chunksRetrieved: response.data.metadata?.chunksRetrieved || 0,
          processingTime: response.data.metadata?.processingTime || 0,
          latency: response.data.metadata?.latency || 0,
          messageCount: response.data.metadata?.messageCount || 0,
          grade: response.data.metadata?.grade || grade,
          subject: response.data.metadata?.subject || subject
        },
        
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Chat service error:', error);

      // Error response
      const errorResponse = {
        success: false,
        answer: null,
        citations: [],
        sourceChunks: [],
        conversationId: conversationId || null,
        timestamp: new Date().toISOString(),
        error: {
          message: 'An error occurred while processing your query',
          code: 500,
          type: 'UNKNOWN_ERROR'
        }
      };

      // Handle different error types
      if (!error.response) {
        errorResponse.error.message = 'Network error. Please check your internet connection.';
        errorResponse.error.type = 'NETWORK_ERROR';
        errorResponse.error.code = 0;
      } else {
        errorResponse.error.message = error.response.data?.error || error.message;
        errorResponse.error.code = error.response.status;
        errorResponse.error.type = getErrorType(error.response.status);
      }

      return errorResponse;
    }
  },

  /**
   * Check AI service health
   * GET /api/query/health
   */
  checkHealth: async () => {
    try {
      const response = await axiosInstance.get('/query/health');
      return {
        success: true,
        status: response.data.status || 'ok',
        ...response.data
      };
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return {
        success: false,
        status: 'error',
        message: error.message
      };
    }
  },

  /**
   * Get AI model information
   * GET /api/query/model-info
   */
  getModelInfo: async () => {
    try {
      const response = await axiosInstance.get('/query/model-info');
      return {
        success: true,
        ...response.data.data
      };
    } catch (error) {
      console.error('❌ Failed to get model info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Send query with automatic retry
   */
  sendQueryWithRetry: async (
    queryText,
    grade,
    subject,
    language,
    conversationId = null,
    top_k = 5,
    maxRetries = 3
  ) => {
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await chatService.sendQuery(
          queryText,
          grade,
          subject,
          language,
          conversationId,
          top_k
        );

        // If successful, return immediately
        if (result.success) {
          if (attempt > 0) {
            console.log(`✅ Query succeeded after ${attempt} retries`);
          }
          return result;
        }

        // If it's not a network error, don't retry
        if (result.error?.type !== 'NETWORK_ERROR' && result.error?.code !== 0) {
          return result;
        }

        lastError = result.error;

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          console.log(`⏳ Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

      } catch (error) {
        lastError = error;

        // Wait before retry
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    return {
      success: false,
      answer: null,
      citations: [],
      sourceChunks: [],
      conversationId: conversationId || null,
      timestamp: new Date().toISOString(),
      error: {
        message: `Failed after ${maxRetries} retry attempts`,
        code: 0,
        type: 'RETRY_EXHAUSTED',
        lastError
      }
    };
  },

  /**
   * Format citation for display
   */
  formatCitation: (citation) => {
    return {
      ...citation,
      displaySource: citation.source,
      displayChapter: citation.chapter !== 'Unknown' ? citation.chapter : citation.section,
      displayPage: `Page ${citation.page}`,
      displayRelevance: `${citation.relevancePercent}% relevant`,
      shortExcerpt: citation.excerpt?.length > 100 
        ? citation.excerpt.substring(0, 100) + '...' 
        : citation.excerpt
    };
  },

  /**
   * Get source chunk by ID
   */
  getSourceChunk: (sourceChunks, chunkId) => {
    return sourceChunks.find(chunk => chunk.chunkId === chunkId);
  }
};

/**
 * Helper: Get error type from status code
 */
const getErrorType = (statusCode) => {
  if (statusCode >= 400 && statusCode < 500) {
    return 'CLIENT_ERROR';
  } else if (statusCode >= 500) {
    return 'SERVER_ERROR';
  }
  return 'UNKNOWN_ERROR';
};

/**
 * Helper: Generate temporary conversation ID
 */
const generateTempId = () => {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default chatService;

// Named exports for convenience
export const { 
  sendQuery, 
  checkHealth, 
  getModelInfo,
  sendQueryWithRetry,
  formatCitation,
  getSourceChunk
} = chatService;
