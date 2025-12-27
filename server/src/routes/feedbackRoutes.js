// src/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// All feedback routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/feedback
 * @desc    Submit feedback on an AI response
 * @access  Private
 * @body    conversationId, messageIndex, rating, comment (optional)
 */
router.post('/', feedbackController.submitFeedback);

/**
 * @route   GET /api/feedback/my-feedback
 * @desc    Get user's own feedback history
 * @access  Private
 * @query   page, limit, rating
 */
router.get('/my-feedback', feedbackController.getMyFeedback);

/**
 * @route   PUT /api/feedback/:id
 * @desc    Update user's feedback
 * @access  Private
 * @body    rating, comment
 */
router.put('/:id', feedbackController.updateFeedback);

/**
 * @route   DELETE /api/feedback/:id
 * @desc    Delete user's feedback
 * @access  Private
 */
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
