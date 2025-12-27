// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    // Debug log (remove in production)
    console.log('[Auth] Header:', authHeader ? 'Present' : 'Missing');
    
    // Check if header exists and has Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided',
        message: 'Authorization header must be: Bearer <token>' 
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token format' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Debug log (remove in production)
    console.log('[Auth] Token decoded for user:', decoded.userId || decoded.id);

    // Set userId on request object (compatible with both formats)
    req.userId = decoded.userId || decoded.id || decoded._id;
    req.user = decoded; // Full decoded token (optional)

    // Proceed to next middleware/controller
    next();

  } catch (error) {
    console.error('[Auth] Error:', error.message);

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired',
        message: 'Please login again' 
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token',
        message: 'Token verification failed' 
      });
    }

    // Generic error
    return res.status(401).json({ 
      success: false,
      error: 'Authentication failed',
      message: error.message 
    });
  }
};

module.exports = authMiddleware;
