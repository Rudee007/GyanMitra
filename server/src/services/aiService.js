// src/services/aiService.js
const axios = require('axios');

// Configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const TIMEOUT = 600000; // 10 minutes
const USE_MOCK = process.env.USE_MOCK_AI === 'true';

/**
 * Process query through AI RAG pipeline
 */
async function processQuery({ query, grade, subject, language = 'english', top_k = 5 }) {
  // Validation
  if (!query || !grade || !subject) {
    throw new Error('Missing required parameters: query, grade, subject');
  }

  if (grade < 5 || grade > 10) {
    throw new Error('Grade must be between 5 and 10');
  }

  // Use mock for development
  if (USE_MOCK) {
    console.log('[AI Service] 🎭 Using MOCK mode');
    return getMockResponse(query, grade, subject, language);
  }

  // Real AI service call
  console.log('[AI Service] 📡 CALLING PYTHON API:');
  console.log(`[AI Service]   URL: ${AI_SERVICE_URL}/query`);
  console.log(`[AI Service]   Query: "${query.substring(0, 50)}..."`);
  console.log(`[AI Service]   Grade: ${grade}`);
  console.log(`[AI Service]   Subject: ${subject}`);
  console.log(`[AI Service]   Language: ${language}`);  // ✅ User's preferred language
  console.log(`[AI Service]   Top K: ${top_k}`);
  
  try {
    const requestPayload = {
      query: query,
      grade: grade,
      subject: subject,
      language: language,  // ✅ Pass user's preferred language
      top_k: top_k || 5
    };

    console.log('[AI Service]   Full payload:', JSON.stringify(requestPayload, null, 2));

    const response = await axios.post(
      `${AI_SERVICE_URL}/query`,
      requestPayload,
      {
        timeout: TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data;

    console.log('[AI Service] ✅ RECEIVED FROM PYTHON API:');
    console.log(`[AI Service]   Response language: ${aiResponse.metadata?.language}`);
    console.log(`[AI Service]   Answer length: ${aiResponse.answer?.length} chars`);
    console.log(`[AI Service]   Citations: ${aiResponse.citations?.length || 0}`);
    console.log(`[AI Service]   Source chunks: ${aiResponse.source_chunks?.length || 0}`);
    console.log(`[AI Service]   Chunks retrieved: ${aiResponse.metadata?.chunks_retrieved}`);
    console.log(`[AI Service]   Confidence: ${aiResponse.metadata?.confidence}`);
    console.log(`[AI Service]   Processing time: ${aiResponse.metadata?.processing_time_ms}ms`);

    // Validate response structure
    if (!aiResponse || !aiResponse.answer || !aiResponse.metadata) {
      throw new Error('Invalid response format from AI service');
    }
    
    // ✅ Transform and return
    return transformResponse(aiResponse);

  } catch (error) {
    console.error('[AI Service] ❌ ERROR:', error.message);
    if (error.response) {
      console.error('[AI Service] Response status:', error.response.status);
      console.error('[AI Service] Response data:', error.response.data);
    }
    return handleAIServiceError(error);
  }
}

/**
 * Transform Python API response to frontend format
 */
function transformResponse(pythonResponse) {
  console.log('[Transform] 🔄 Starting transformation...');
  
  const { answer, metadata, citations, source_chunks } = pythonResponse;
  
  console.log('[Transform]   Citations received:', citations?.length || 0);
  console.log('[Transform]   Source chunks received:', source_chunks?.length || 0);

  // Transform citations
  const formattedCitations = (citations || []).map((citation, index) => {
    return {
      number: citation.id || (index + 1),
      source: citation.source,
      chapter: citation.chapter,
      section: citation.section,
      page: citation.page,
      excerpt: citation.excerpt,
      relevance: citation.relevance,
      relevancePercent: Math.round((citation.relevance || 0) * 100),
      chunkId: citation.chunk_id
    };
  });

  console.log('[Transform]   Formatted citations:', formattedCitations.length);

  // Transform source chunks
  const formattedSourceChunks = (source_chunks || []).map(chunk => ({
    chunkId: chunk.chunk_id,
    fullText: chunk.full_text,
    page: chunk.metadata?.page || 0,
    chapter: chunk.metadata?.chapter || 'Unknown',
    section: chunk.metadata?.section || 'General',
    tokenCount: chunk.metadata?.token_count || 0,
    relevance: chunk.relevance,
    relevancePercent: Math.round((chunk.relevance || 0) * 100)
  }));

  console.log('[Transform]   Formatted source chunks:', formattedSourceChunks.length);

  // Return frontend-friendly format
  const finalResponse = {
    answer: answer,
    citations: formattedCitations,
    sourceChunks: formattedSourceChunks,
    language: metadata.language,
    in_scope: true,
    metadata: {
      model: metadata.model,
      confidence: metadata.confidence,
      tokensUsed: metadata.tokens_used,
      chunksRetrieved: metadata.chunks_retrieved,
      processingTime: metadata.processing_time_ms,
      grade: metadata.grade,
      subject: metadata.subject,
      language: metadata.language
    }
  };
  
  console.log('[Transform] ✅ Transformation complete');
  console.log(`[Transform]   Final citations: ${finalResponse.citations.length}`);
  console.log(`[Transform]   Final source chunks: ${finalResponse.sourceChunks.length}`);
  
  return finalResponse;
}

/**
 * Handle errors from AI service
 */
function handleAIServiceError(error) {
  if (error.code === 'ECONNREFUSED') {
    throw new Error('AI service is not running. Please start the Python FastAPI service on port 8000.');
  }
  
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    throw new Error('AI service timeout. The LLM is taking too long. Please try again.');
  }
  
  if (error.response) {
    const status = error.response.status;
    const errorData = error.response.data;
    const errorMsg = errorData?.detail || errorData?.error || 'Unknown AI service error';
    
    throw new Error(`AI service error (${status}): ${errorMsg}`);
  }
  
  throw new Error(`AI service error: ${error.message}`);
}

/**
 * Check if AI service is healthy
 */
async function checkHealth() {
  if (USE_MOCK) {
    return { 
      status: 'ok', 
      mode: 'mock', 
      timestamp: new Date()
    };
  }

  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 3000 });
    return { 
      status: 'ok', 
      mode: 'live',
      ...response.data,
      timestamp: new Date()
    };
  } catch (error) {
    return { 
      status: 'error', 
      mode: 'live',
      message: error.message,
      timestamp: new Date()
    };
  }
}

/**
 * Get model information
 */
async function getModelInfo() {
  if (USE_MOCK) {
    return { model: 'mock-model-v1', quantization: 'N/A' };
  }

  try {
    const response = await axios.get(`${AI_SERVICE_URL}/model-info`, { timeout: 3000 });
    return response.data;
  } catch (error) {
    throw new Error('Failed to retrieve model information');
  }
}

/**
 * MOCK RESPONSE for development
 */
function getMockResponse(query, grade, subject, language) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockAnswer = `[MOCK] Answer for: "${query}" in ${language}`;
      resolve(transformResponse({
        answer: mockAnswer,
        metadata: {
          grade, subject, language,
          model: 'mock', tokens_used: 512,
          confidence: 0.87, chunks_retrieved: 2,
          processing_time_ms: 1500
        },
        citations: [],
        source_chunks: []
      }));
    }, 1500);
  });
}

module.exports = {
  processQuery,
  checkHealth,
  getModelInfo
};
