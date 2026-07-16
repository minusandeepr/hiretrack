/**
 * @file src/models/User.model.js
 * @description Mongoose schema and model for the `users` collection.
 *
 *   Key behaviours:
 *   - Passwords are automatically hashed (bcryptjs, cost 12) via a
 *     pre-save hook — only when the `password` field has been modified.
 *   - The `password` field is excluded from query results by default
 *     (select: false).  Use `.select('+password')` when you need it.
 *   - Instance method `comparePassword` performs a constant-time comparison.
 *   - Compound index on { role, isActive } supports admin dashboard queries.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ── Constants ───────────────────────────────────────────────────────────────
const BCRYPT_COST_FACTOR = 12;

// ── Schema definition ───────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    /** Full name of the user. */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },

    /** Email address — serves as the login identifier. */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    /**
     * Hashed password.
     * `select: false` prevents it from being included in normal queries;
     * use `.select('+password')` when authentication requires it.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    /**
     * Role within the ATS.
     * The very first registered user is automatically promoted to "admin"
     * by the auth service; every subsequent user defaults to "recruiter".
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'recruiter'],
        message: 'Role must be either admin or recruiter',
      },
      default: 'recruiter',
    },

    /** Soft-delete / deactivation flag. */
    isActive: {
      type: Boolean,
      default: true,
    },

    /**
     * Hashed refresh token stored for token-rotation validation.
     * Cleared on logout.  `select: false` keeps it out of normal reads.
     */
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    /** Automatically adds createdAt and updatedAt fields. */
    timestamps: true,

    /**
     * Strip internal fields when converting to JSON (e.g. for API
     * responses).  __v and refreshToken should never leak to clients.
     */
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ── Indexes ─────────────────────────────────────────────────────────────────
// The `unique: true` on `email` already creates an index.
// Add a compound index for admin dashboard queries that filter by role+active.
userSchema.index({ role: 1, isActive: 1 });

// ── Pre-save hook: hash password ────────────────────────────────────────────
/**
 * Before saving, hash the password if (and only if) it has been modified.
 * This avoids re-hashing on unrelated updates like name changes.
 */
userSchema.pre('save', async function preSaveHashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(BCRYPT_COST_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// ── Instance methods ────────────────────────────────────────────────────────
/**
 * Compare a plain-text candidate password against the stored hash.
 *
 * @param {string} candidatePassword — The plain-text password to verify.
 * @returns {Promise<boolean>} — True if the passwords match.
 */
userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword,
) {
  // `this.password` may not be selected — callers must use `.select('+password')`.
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Model export ────────────────────────────────────────────────────────────
const User = mongoose.model('User', userSchema);

export default User;
