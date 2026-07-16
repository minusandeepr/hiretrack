/**
 * @file src/controllers/auth.controller.js
 * @description Request handlers for authentication endpoints.
 *
 *   Each handler extracts data from the request, delegates to authService,
 *   and formats the response using ApiResponse.  Errors thrown by the service
 *   are caught by asyncHandler and forwarded to the global error middleware.
 *
 *   Endpoints:
 *     POST /api/auth/register  → register
 *     POST /api/auth/login     → login
 *     POST /api/auth/refresh   → refresh
 *     POST /api/auth/logout    → logout  (protected)
 *     GET  /api/auth/me        → getMe   (protected)
 */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import authService from '../services/auth.service.js';

// ── Register ────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 *
 * Creates a new user account.  The first registered user is automatically
 * assigned the admin role.
 *
 * Body: { name, email, password }
 * Returns: 201 with the created user (no tokens — user must log in).
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await authService.register({ name, email, password });

  ApiResponse.success(res, { user }, 'Registration successful', 201);
});

// ── Login ───────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 *
 * Authenticates a user with email + password.
 *
 * Body: { email, password }
 * Returns: 200 with { user, accessToken }.
 * Side effect: sets an HTTP-only `refreshToken` cookie.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.login({
    email,
    password,
  });

  // Set refresh token as HTTP-only cookie
  res.cookie('refreshToken', refreshToken, authService.getRefreshCookieOptions());

  ApiResponse.success(res, { user, accessToken }, 'Login successful');
});

// ── Refresh ─────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/refresh
 *
 * Issues a new access token using the refresh token cookie.
 * Implements token rotation — the old refresh token is invalidated and a
 * new cookie is set.
 *
 * Returns: 200 with { accessToken }.
 * Side effect: rotates the `refreshToken` cookie.
 */
export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  const { accessToken, refreshToken } =
    await authService.refreshAccessToken(incomingRefreshToken);

  // Rotate the cookie
  res.cookie('refreshToken', refreshToken, authService.getRefreshCookieOptions());

  ApiResponse.success(res, { accessToken }, 'Token refreshed');
});

// ── Logout ──────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/logout
 *
 * Clears the refresh token from the database and the cookie.
 * Requires authentication.
 *
 * Returns: 200 with confirmation message.
 */
export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  // Clear the refresh cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: authService.getRefreshCookieOptions().secure,
    sameSite: authService.getRefreshCookieOptions().sameSite,
    path: '/api/auth',
  });

  ApiResponse.success(res, null, 'Logged out successfully');
});

// ── Get Current User ────────────────────────────────────────────────────────

/**
 * GET /api/auth/me
 *
 * Returns the profile of the currently authenticated user.
 * Requires authentication.
 *
 * Returns: 200 with { user }.
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);

  ApiResponse.success(res, { user }, 'User profile retrieved');
});
