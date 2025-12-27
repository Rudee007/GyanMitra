// src/controllers/userController.js
const User = require('../models/User');

/**
 * Get current user's profile
 * GET /api/users/profile
 */
async function getProfile(req, res) {
  try {
    const userId = req.userId; // from auth middleware

    const user = await User.findById(userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Return safe user object
    res.json({
      success: true,
      data: user.toSafeObject()
    });

  } catch (error) {
    console.error('[User] Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
}

/**
 * Update current user's profile
 * PUT /api/users/profile
 */
async function updateProfile(req, res) {
  try {
    const userId = req.userId;
    const { name, grade, preferredLanguage, subjects } = req.body;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // ===== Validation =====
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Name cannot be empty'
        });
      }
      user.name = name.trim();
    }

    if (grade !== undefined) {
      const gradeNum = parseInt(grade);
      if (isNaN(gradeNum) || gradeNum < 5 || gradeNum > 10) {
        return res.status(400).json({
          success: false,
          error: 'Grade must be between 5 and 10'
        });
      }
      user.grade = gradeNum;
    }

    if (preferredLanguage !== undefined) {
      const validLanguages = ['english', 'hindi', 'marathi', 'urdu'];
      const lang = preferredLanguage.toLowerCase();
      
      if (!validLanguages.includes(lang)) {
        return res.status(400).json({
          success: false,
          error: `Language must be one of: ${validLanguages.join(', ')}`
        });
      }
      user.preferredLanguage = lang;
    }

    if (subjects !== undefined) {
      if (!Array.isArray(subjects)) {
        return res.status(400).json({
          success: false,
          error: 'Subjects must be an array'
        });
      }

      const validSubjects = ['math', 'science', 'social_science', 'english', 'hindi', 'sanskrit'];
      const invalidSubjects = subjects.filter(s => !validSubjects.includes(s.toLowerCase()));
      
      if (invalidSubjects.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid subjects: ${invalidSubjects.join(', ')}. Valid subjects are: ${validSubjects.join(', ')}`
        });
      }

      user.subjects = subjects.map(s => s.toLowerCase());
    }

    // ===== Save Updated User =====
    await user.save();

    console.log(`[User] Profile updated for user ${userId}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toSafeObject()
    });

  } catch (error) {
    console.error('[User] Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
}

module.exports = {
  getProfile,
  updateProfile
};
