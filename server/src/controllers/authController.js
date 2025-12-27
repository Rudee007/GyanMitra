const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const sendEmail = require("../services/mailer");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Helper: sign JWT
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });


  module.exports.register = async (req, res) => {
    try {
      const { name, email, password, grade, preferredLanguage, subjects } = req.body;
  
      // Validate input
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!name || !email || !password || !grade || !preferredLanguage || !subjects) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required'
        });
      }
  
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }
  
      // Check if user exists
      const emailLower = email.toLowerCase();
      const existingUser = await User.findOne({ email: emailLower });
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Email already registered'
        });
      }
  
      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);
  
      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
      // Create user
      const user = await User.create({
        name,
        email: emailLower,
        passwordHash,
        grade,
        preferredLanguage,
        subjects,
        role: 'user',
        verified: false, // Not verified yet
        hasPassword: true,
        providers: [],
        verification: {
          verified: false,
          token: verificationToken,
          sentAt: new Date(),
          expiresAt: verificationExpires
        }
      });
  
      // Send verification email
      const verifyURL = `http://localhost:5173/verify?token=${verificationToken}`;
      
      await sendEmail({
        to: user.email,
        subject: 'Verify Your GyanMitra Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6C63FF;">Welcome to GyanMitra! 📚</h2>
            <p>Hello ${user.name},</p>
            <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
            <a href="${verifyURL}" style="display: inline-block; padding: 12px 24px; background-color: #6C63FF; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
              Verify Email Address
            </a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${verifyURL}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create this account, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">GyanMitra - Your NCERT Study Companion</p>
          </div>
        `
      });
  
      console.log('✅ Verification email sent to:', user.email);
      console.log('🔑 Verification token:', verificationToken);
  
      // Return response (NO token yet - user must verify first)
      res.status(201).json({
        success: true,
        message: 'Account created! Please check your email to verify.',
        email: user.email,
        verified: false
      });
  
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed. Please try again.'
      });
    }
  };
  
  /**
   * Verify Email - Called when user clicks link in email
   */
  module.exports.verifyEmail = async (req, res) => {
    try {
      const { token } = req.query;
  
      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Verification token is required'
        });
      }
  
      // Find user with this token
      const user = await User.findOne({
        'verification.token': token,
        'verification.expiresAt': { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired verification token'
        });
      }
  
      // Mark as verified
      user.verified = true;
      user.verification.verified = true;
      user.verification.verifiedAt = new Date();
      await user.save();
  
      console.log('✅ Email verified:', user.email);
  
      // Return success (can redirect to app deep link)
      res.status(200).json({
        success: true,
        message: 'Email verified successfully! You can now login.',
        verified: true
      });
  
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Verification failed. Please try again.'
      });
    }
  };
  
  /**
   * Resend Verification Email
   */
  module.exports.resendVerification = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }
  
      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
  
      if (user.verified) {
        return res.status(400).json({
          success: false,
          error: 'Email already verified'
        });
      }
  
      // Generate new token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  
      user.verification.token = verificationToken;
      user.verification.sentAt = new Date();
      user.verification.expiresAt = verificationExpires;
      await user.save();
  
      // Resend email
      const verifyURL = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
      
      await sendEmail({
        to: user.email,
        subject: 'Verify Your GyanMitra Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6C63FF;">Verify Your Email 📧</h2>
            <p>Hello ${user.name},</p>
            <p>Here's your new verification link:</p>
            <a href="${verifyURL}" style="display: inline-block; padding: 12px 24px; background-color: #6C63FF; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
              Verify Email Address
            </a>
            <p>This link will expire in 24 hours.</p>
          </div>
        `
      });
  
      res.status(200).json({
        success: true,
        message: 'Verification email resent. Please check your inbox.'
      });
  
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resend verification email'
      });
    }
  };
  
  /**
   * Check Verification Status - Mobile app polls this
   */
  module.exports.checkVerification = async (req, res) => {
    try {
      const { email } = req.query;
  
      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }
  
      const user = await User.findOne({ email: email.toLowerCase() });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        verified: user.verified,
        email: user.email
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to check verification status'
      });
    }
  };
    
  // src/controllers/authController.js

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = signToken(user);

    // Return BOTH token AND user
    res.status(200).json({
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        grade: user.grade,
        preferredLanguage: user.preferredLanguage,
        subjects: user.subjects,
        verified: user.verified,
        role: user.role,
        hasPassword: user.hasPassword,
        providers: user.providers,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    });
  }
};


  module.exports.googleAuth = async (req, res) => {
    try {
      const { credential } = req.body;
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      const { sub, email, name, picture } = payload;
      const emailLower = email.toLowerCase();
  
      const user = await User.findOneAndUpdate(
        {
          $or: [
            { email: emailLower },
            {
              providers: {
                $elemMatch: { provider: "google", providerId: sub },
              },
            },
          ],
        },
        {
          name,
          email: emailLower,
          $addToSet: {
            providers: { provider: "google", providerId: sub, picture },
          },
          $set: { "verification.verified": true },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
  
      user.lastLoginAt = new Date();
      await user.save();
  
      const token = signToken(user);
      res.json({ token });
      
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  module.exports.getUserInfo = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("name email");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  