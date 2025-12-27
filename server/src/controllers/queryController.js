// src/controllers/queryController.js
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const aiService = require('../services/aiService');

/**
 * Map frontend subject names to Python API expected names
 */
const SUBJECT_MAPPING = {
  'math': 'mathematics',
  'mathematics': 'mathematics',
  'science': 'science',
  'social_science': 'social_studies',
  'social_studies': 'social_studies',
  'english': 'english',
  'hindi': 'hindi',
  'sanskrit': 'sanskrit'
};

/**
 * Submit a new query or follow-up question
 */
async function submitQuery(req, res) {
  try {
    const { query, grade, subject, language, conversationId, top_k } = req.body;
    const userId = req.userId; // from auth middleware

    // ===== DEBUG: Log incoming request =====
    console.log('='.repeat(60));
    console.log('[Query] 📥 INCOMING REQUEST');
    console.log('='.repeat(60));
    console.log(`[Query] User ID: ${userId}`);
    console.log(`[Query] Query: "${query}"`);
    console.log(`[Query] Grade: ${grade}`);
    console.log(`[Query] Subject: ${subject}`);
    console.log(`[Query] Language (from request): ${language || 'NOT PROVIDED'}`);
    console.log(`[Query] Conversation ID: ${conversationId || 'NEW'}`);
    console.log(`[Query] Top K: ${top_k}`);
    console.log('='.repeat(60));

    // ===== Input Validation =====
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query text is required'
      });
    }

    if (query.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Query is too long (max 500 characters)'
      });
    }

    if (!grade || grade < 5 || grade > 10) {
      return res.status(400).json({
        success: false,
        error: 'Grade must be between 5 and 10'
      });
    }

    const validSubjects = ['math', 'mathematics', 'science', 'social_science', 'social_studies', 'english', 'hindi', 'sanskrit'];
    if (!subject || !validSubjects.includes(subject.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Subject must be one of: ${validSubjects.join(', ')}`
      });
    }

    // Validate and limit top_k
    const retrievalLimit = top_k ? Math.min(Math.max(parseInt(top_k), 1), 10) : 5;

    // ===== Load User for Language Preference =====
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // ✅ CRITICAL FIX: User profile preference ALWAYS takes priority
    // Request language is ignored if user has a preference set
    const userLanguage = user.preferredLanguage || language || 'english';
    
    console.log('[Query] 🔤 LANGUAGE RESOLUTION:');
    console.log(`[Query]   - From request body: ${language || 'NOT PROVIDED'}`);
    console.log(`[Query]   - From user profile (PRIORITY): ${user.preferredLanguage || 'NOT SET'}`);
    console.log(`[Query]   - FINAL LANGUAGE: ${userLanguage} ✅`);
    console.log('='.repeat(60));

    // ===== Track Latency =====
    const startTime = Date.now();

    // ===== Load or Create Conversation =====
    let conversation;
    let isNewConversation = false;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: userId
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found or you do not have access'
        });
      }

      console.log(`[Query] ♻️  Follow-up query in conversation ${conversationId}`);
    } else {
      isNewConversation = true;
      conversation = new Conversation({
        userId,
        metadata: {
          grade: parseInt(grade),
          subject: subject.toLowerCase(),
          language: userLanguage.toLowerCase()
        },
        messages: [],
        status: 'active'
      });

      console.log('[Query] 🆕 Creating new conversation');
    }

    // ===== Add User Message =====
    conversation.addMessage({
      role: 'user',
      content: query.trim(),
      timestamp: new Date()
    });

    // ===== Call AI Service =====
    let aiResponse;
    try {
      console.log('[Query] 🤖 CALLING AI SERVICE:');
      console.log(`[Query]   Query: "${query.substring(0, 50)}..."`);
      
      const mappedSubject = SUBJECT_MAPPING[subject.toLowerCase()] || subject.toLowerCase();
      
      const aiRequestPayload = {
        query: query.trim(),
        grade: parseInt(grade),
        subject: mappedSubject,
        language: userLanguage.toLowerCase(),  // ✅ User's preferred language
        top_k: retrievalLimit
      };
      
      console.log('[Query]   Payload:', JSON.stringify(aiRequestPayload, null, 2));
      console.log('='.repeat(60));
      
      aiResponse = await aiService.processQuery(aiRequestPayload);

      console.log('[Query] ✅ AI SERVICE RESPONSE:');
      console.log(`[Query]   Model: ${aiResponse.metadata?.model}`);
      console.log(`[Query]   Response Language: ${aiResponse.metadata?.language || aiResponse.language}`);
      console.log(`[Query]   Confidence: ${aiResponse.metadata?.confidence}`);
      console.log(`[Query]   Citations: ${aiResponse.citations?.length || 0}`);
      console.log(`[Query]   Source chunks: ${aiResponse.sourceChunks?.length || 0}`);
      console.log(`[Query]   Answer preview: "${aiResponse.answer?.substring(0, 100)}..."`);
      console.log('='.repeat(60));

    } catch (aiError) {
      console.error('[Query] ❌ AI SERVICE ERROR:', aiError.message);
      console.error('[Query] Full error:', aiError);
      
      await conversation.save();
      
      return res.status(503).json({
        success: false,
        error: 'AI service unavailable',
        message: aiError.message,
        conversationId: conversation._id
      });
    }

    const totalLatency = Date.now() - startTime;

    // ===== Add AI Response =====
    conversation.addMessage({
      role: 'assistant',
      content: aiResponse.answer,
      citations: aiResponse.citations || [],
      sourceChunks: aiResponse.sourceChunks || [],
      timestamp: new Date(),
      metadata: {
        language: aiResponse.metadata?.language || aiResponse.language || userLanguage,
        inScope: aiResponse.in_scope,
        latency: totalLatency,
        modelUsed: aiResponse.metadata?.model || 'Mistral-7B-Instruct-v0.2',
        confidence: aiResponse.metadata?.confidence,
        tokensUsed: aiResponse.metadata?.tokensUsed,
        chunksRetrieved: aiResponse.metadata?.chunksRetrieved,
        processingTime: aiResponse.metadata?.processingTime
      }
    });

    await conversation.save();

    console.log(`[Query] 💾 Conversation saved`);
    console.log(`[Query] ⏱️  Total latency: ${totalLatency}ms`);
    console.log('='.repeat(60));

    // ===== Return Response =====
    const responsePayload = {
      success: true,
      conversationId: conversation._id,
      isNewConversation,
      answer: aiResponse.answer,
      citations: aiResponse.citations || [],
      sourceChunks: aiResponse.sourceChunks || [],
      language: aiResponse.metadata?.language || aiResponse.language || userLanguage,
      inScope: aiResponse.in_scope,
      metadata: {
        latency: totalLatency,
        messageCount: conversation.getMessageCount(),
        model: aiResponse.metadata?.model || 'Mistral-7B-Instruct-v0.2',
        confidence: aiResponse.metadata?.confidence,
        tokensUsed: aiResponse.metadata?.tokensUsed,
        chunksRetrieved: aiResponse.metadata?.chunksRetrieved,
        processingTime: aiResponse.metadata?.processingTime,
        grade: aiResponse.metadata?.grade,
        subject: aiResponse.metadata?.subject
      }
    };

    console.log('[Query] 📤 SENDING RESPONSE TO FRONTEND:');
    console.log(`[Query]   Language: ${responsePayload.language}`);
    console.log(`[Query]   Answer length: ${responsePayload.answer?.length} chars`);
    console.log(`[Query]   Citations count: ${responsePayload.citations?.length || 0}`);
    console.log('='.repeat(60));

    res.json(responsePayload);

  } catch (error) {
    console.error('[Query] ❌ UNEXPECTED ERROR:', error);
    console.error('[Query] Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to process query',
      message: error.message
    });
  }
}

/**
 * Check AI service health
 */
async function checkAIHealth(req, res) {
  try {
    const health = await aiService.checkHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

/**
 * Get AI model information
 */
async function getModelInfo(req, res) {
  try {
    const modelInfo = await aiService.getModelInfo();
    res.json({
      success: true,
      data: modelInfo
    });
  } catch (error) {
    console.error('[Model Info] Error:', error);
    res.status(503).json({
      success: false,
      error: 'Failed to get model information',
      message: error.message
    });
  }
}

module.exports = {
  submitQuery,
  checkAIHealth,
  getModelInfo
};
