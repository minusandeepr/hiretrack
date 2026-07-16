/**
 * @file src/routes/auth.routes.js
 * @description Express router for authentication endpoints.
 *
 *   Route            Method   Auth?   Description
 *   ──────────────── ──────── ─────── ──────────────────────────────
 *   /api/auth/register  POST    No     Create a new user account
 *   /api/auth/login     POST    No     Authenticate and receive tokens
 *   /api/auth/refresh   POST    No     Refresh the access token (cookie)
 *   /api/auth/logout    POST    Yes    Invalidate the refresh token
 *   /api/auth/me        GET     Yes    Get current user profile
 */

import { Router } from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import validate from '../middleware/validate.middleware.js';

const router = Router();

// ── Public routes ───────────────────────────────────────────────────────────

router.post('/register', ...registerValidator, validate, register);
router.post('/login', ...loginValidator, validate, login);
router.post('/refresh', refresh);

// ── Protected routes ────────────────────────────────────────────────────────

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
