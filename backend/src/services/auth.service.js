/**
 * @file src/services/auth.service.js
 * @description Business logic for authentication.
 *
 *   Handles user registration, login, token refresh, logout, and profile
 *   retrieval.  Controllers delegate to this service; the service never
 *   touches req/res directly.
 *
 *   Token strategy:
 *   - Access token  → short-lived JWT returned in the JSON body.
 *   - Refresh token → long-lived JWT stored as an HTTP-only cookie AND
 *                     hashed in the user document for rotation validation.
 *
 *   First-user auto-admin:
 *   - If no users exist in the database, the first registered user is
 *     automatically promoted to the "admin" role.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';

// ── Token helpers ───────────────────────────────────────────────────────────

/**
 * Sign a short-lived access token.
 * @param {string} userId
 * @returns {string} JWT
 */
const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpiresIn,
  });

/**
 * Sign a long-lived refresh token.
 * @param {string} userId
 * @returns {string} JWT
 */
const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });

/**
 * Parse a duration string like "7d" or "15m" into milliseconds.
 * Used to set the cookie maxAge.
 * @param {string} duration
 * @returns {number} milliseconds
 */
const durationToMs = (duration) => {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * multipliers[unit];
};

/** Cost factor for hashing refresh tokens before DB storage. */
const REFRESH_TOKEN_HASH_ROUNDS = 10;

// ── Service methods ─────────────────────────────────────────────────────────

const authService = {
  /**
   * Register a new user.
   *
   * - Checks for duplicate email.
   * - Auto-promotes the first user to admin.
   * - Returns the created user (without password/refreshToken).
   *
   * @param {{ name: string, email: string, password: string }} payload
   * @returns {Promise<object>} The created user document.
   */
  async register({ name, email, password }) {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('A user with this email already exists', 'DUPLICATE_EMAIL');
    }

    // Determine role — first user becomes admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'recruiter';

    const user = await User.create({ name, email, password, role });

    return user.toJSON();
  },

  /**
   * Authenticate a user and return tokens.
   *
   * - Verifies email exists and account is active.
   * - Compares password against the stored bcrypt hash.
   * - Generates an access token (returned in body) and a refresh token
   *   (set as HTTP-only cookie + hashed in the DB).
   *
   * @param {{ email: string, password: string }} payload
   * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
   */
  async login({ email, password }) {
    // Find user WITH password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw ApiError.forbidden(
        'Your account has been deactivated. Contact an administrator.',
        'ACCOUNT_DEACTIVATED',
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Hash the refresh token and store it on the user document
    const hashedRefreshToken = await bcrypt.hash(refreshToken, REFRESH_TOKEN_HASH_ROUNDS);
    user.refreshToken = hashedRefreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  },

  /**
   * Refresh the access token using a valid refresh token.
   *
   * Token rotation: the old refresh token is invalidated and a new pair is
   * issued.  If the incoming token doesn't match the stored hash the user
   * is logged out (potential token theft).
   *
   * @param {string} incomingRefreshToken — the refresh token from the cookie.
   * @returns {Promise<{ accessToken: string, refreshToken: string }>}
   */
  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw ApiError.unauthorized('Refresh token is required', 'NO_REFRESH_TOKEN');
    }

    // Verify the JWT signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, config.jwtRefreshSecret);
    } catch (err) {
      throw ApiError.unauthorized('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    // Find the user and compare the hashed refresh token
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || !user.refreshToken) {
      throw ApiError.unauthorized('Refresh token not recognised', 'INVALID_REFRESH_TOKEN');
    }

    const isTokenValid = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
    if (!isTokenValid) {
      // Potential token theft — clear all refresh tokens
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
      throw ApiError.unauthorized(
        'Refresh token reuse detected — logged out for security',
        'TOKEN_REUSE',
      );
    }

    // Rotate: generate new pair
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, REFRESH_TOKEN_HASH_ROUNDS);
    user.refreshToken = hashedRefreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  /**
   * Logout — clear the refresh token from the user document.
   *
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
  },

  /**
   * Get the current user's profile.
   *
   * @param {string} userId
   * @returns {Promise<object>} The user document (without password/refreshToken).
   */
  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }
    return user.toJSON();
  },

  // ── Helpers exposed for cookie configuration ────────────────────────────

  /**
   * Standard options for the refresh-token cookie.
   * @returns {import('express').CookieOptions}
   */
  getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'strict' : 'lax',
      maxAge: durationToMs(config.jwtRefreshExpiresIn),
      path: '/api/auth',
    };
  },
};

export default authService;
