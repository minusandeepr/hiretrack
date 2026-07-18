/**
 * @file src/middleware/auth.middleware.js
 * @description Authentication and authorisation middleware.
 *
 *   protect  — Verifies the JWT access token from the Authorization header.
 *              On success, attaches the user document to `req.user`.
 *
 *   authorize — Higher-order middleware that restricts access to users whose
 *               role is in the supplied allow-list.
 *
 *   Usage:
 *     router.get('/admin-only', protect, authorize('admin'), handler);
 *     router.get('/any-user',   protect, handler);
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// ── protect ─────────────────────────────────────────────────────────────────

/**
 * Verify the Bearer access token and attach `req.user`.
 *
 * Expected header:  Authorization: Bearer <token>
 *
 * Checks:
 *  1. Token is present in the header.
 *  2. Token signature and expiry are valid.
 *  3. The user still exists in the database.
 *  4. The user's account is active.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  // 1 — Extract token
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized(
      'You are not logged in. Please log in to access this resource.',
      'NO_TOKEN',
    );
  }

  // 2 — Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtAccessSecret);
    console.log("DECODED TOKEN:", decoded);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Your session has expired. Please log in again.', 'TOKEN_EXPIRED');
    }
    throw ApiError.unauthorized('Invalid authentication token.', 'INVALID_TOKEN');
  }

  // 3 — Check user exists
  const user = await User.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized(
      'The user belonging to this token no longer exists.',
      'USER_NOT_FOUND',
    );
  }

  // 4 — Check account is active
  if (!user.isActive) {
    throw ApiError.forbidden(
      'Your account has been deactivated. Contact an administrator.',
      'ACCOUNT_DEACTIVATED',
    );
  }

  // Attach user to request — downstream handlers access via req.user
  req.user = user;
  next();
});

// ── authorize ───────────────────────────────────────────────────────────────

/**
 * Restrict access to specific roles.
 *
 * Must be used AFTER `protect` (needs req.user).
 *
 * @param {...string} roles — Allowed role names (e.g. 'admin', 'recruiter').
 * @returns {Function} Express middleware.
 *
 * @example
 *   router.delete('/users/:id', protect, authorize('admin'), deleteUser);
 */
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Role "${req.user.role}" is not authorised to access this resource.`,
        'INSUFFICIENT_ROLE',
      );
    }
    next();
  };
};
