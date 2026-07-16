/**
 * auth.api.js
 * ---------------------------------------------------------------------------
 * Authentication API service for HireTrack ATS.
 *
 * Thin wrappers around the backend auth endpoints.  Every method returns an
 * Axios response promise so callers can destructure `{ data }`.
 */

import api from './axios.js';

const authAPI = {
  /**
   * Register a new user.
   * @param {{ name: string, email: string, password: string }} data
   */
  register(data) {
    return api.post('/auth/register', data);
  },

  /**
   * Log in and receive an access token (refresh token set via cookie).
   * @param {{ email: string, password: string }} data
   */
  login(data) {
    return api.post('/auth/login', data);
  },

  /**
   * Obtain a fresh access token using the HTTP-only refresh cookie.
   */
  refreshToken() {
    return api.post('/auth/refresh');
  },

  /**
   * Log out — clears the refresh cookie on the server.
   */
  logout() {
    return api.post('/auth/logout');
  },

  /**
   * Fetch the currently authenticated user's profile.
   */
  getMe() {
    return api.get('/auth/me');
  },
};

export default authAPI;
