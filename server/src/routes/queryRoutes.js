// src/routes/queryRoutes.js
const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const authMiddleware = require('../middleware/authMiddleware');

// All query routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/query
 * @desc    Submit a query (new or follow-up)
 * @access  Private
 */
router.post('/', queryController.submitQuery);

/**
 * @route   GET /api/query/health
 * @desc    Check AI service health
 * @access  Private
 */
router.get('/health', queryController.checkAIHealth);
router.get('/model-info', queryController.getModelInfo);

module.exports = router;
