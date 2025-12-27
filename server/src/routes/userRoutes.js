// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/profile', userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 * @body    name, grade, preferredLanguage, subjects (all optional)
 */
router.put('/profile', userController.updateProfile);

module.exports = router;
