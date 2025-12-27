// src/routes/conversationRoutes.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middleware/authMiddleware');

// All conversation routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/conversations
 * @desc    Get list of user's conversations (paginated)
 * @access  Private
 * @query   page, limit, status, subject, grade
 */
router.get('/', conversationController.getConversations);

/**
 * @route   GET /api/conversations/:id
 * @desc    Get specific conversation by ID
 * @access  Private
 */
router.get('/:id', conversationController.getConversationById);

/**
 * @route   DELETE /api/conversations/:id
 * @desc    Archive conversation (soft delete)
 * @access  Private
 */
router.delete('/:id', conversationController.deleteConversation);

/**
 * @route   PUT /api/conversations/:id/restore
 * @desc    Restore archived conversation
 * @access  Private
 */
router.put('/:id/restore', conversationController.restoreConversation);

module.exports = router;
