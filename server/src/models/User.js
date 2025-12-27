// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const providerSubSchema = new mongoose.Schema(
  {
    provider:     { type: String, required: true, lowercase: true },
    providerId:   { type: String, required: true },
    picture:      String,
    accessToken:  String,
    refreshToken: String
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    /* Core Identity */
    name:  { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },

    /* Email Verification */
    verification: {
      verified:  { type: Boolean, default: false },
      token:     String,
      sentAt:    Date,
      expiresAt: Date
    },

    /* Password hash for local auth */
    passwordHash: String,

    /* OAuth providers (Google, etc.) */
    providers: [providerSubSchema],

    /* NCERT-specific fields */
    grade: { 
      type: Number, 
      required: false,
      min: 5,
      max: 10,
      enum: [5, 6, 7, 8, 9, 10]
    },
    
    preferredLanguage: {
      type: String,
      enum: ['english', 'hindi', 'marathi', 'urdu'],
      default: 'english',
      lowercase: false
    },

    subjects: [{
      type: String,
      enum: ['math', 'science', 'social_science', 'english', 'hindi', 'sanskrit'],
      lowercase: false
    }],

    /* User role and metadata */
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user' 
    },

    lastLoginAt: Date
  },
  { 
    timestamps: true  // adds createdAt & updatedAt
  }
);

/* ---------- Indexes for performance ---------- */
userSchema.index({ email: 1 });
userSchema.index({ grade: 1 });
userSchema.index({ preferredLanguage: 1 });

/* ---------- Virtual for displaying password existence ---------- */
userSchema.virtual('hasPassword').get(function() {
  return !!this.passwordHash;
});

/* ---------- Instance Methods ---------- */

/**
 * Compare candidate password with stored hash
 * @param {string} candidatePassword - Plain text password to check
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Hash and set password
 * @param {string} plainPassword - Plain text password
 */
userSchema.methods.setPassword = async function(plainPassword) {
  const saltRounds = 10;
  this.passwordHash = await bcrypt.hash(plainPassword, saltRounds);
};

/**
 * Check if user has linked OAuth provider
 * @param {string} providerName - e.g., 'google'
 * @returns {boolean}
 */
userSchema.methods.hasProvider = function(providerName) {
  return this.providers.some(p => p.provider === providerName);
};

/**
 * Get safe user object (without sensitive fields)
 * @returns {Object}
 */
userSchema.methods.toSafeObject = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    grade: this.grade,
    preferredLanguage: this.preferredLanguage,
    subjects: this.subjects,
    verified: this.verification.verified,
    role: this.role,
    hasPassword: this.hasPassword,
    providers: this.providers.map(p => ({ provider: p.provider })),
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt
  };
};

/* ---------- Pre-save Hook ---------- */
// Note: Password hashing is now handled via setPassword method
// This ensures compatibility with both local auth and OAuth

/* ---------- Model Export ---------- */
const User = mongoose.model('User', userSchema);
module.exports = User;
