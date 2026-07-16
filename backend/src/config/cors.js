/**
 * @file src/config/cors.js
 * @description CORS configuration for the Express application.
 *   Only the CLIENT_URL origin is whitelisted.  Credentials (cookies) are
 *   allowed so that HTTP-only refresh-token cookies can travel cross-origin.
 */

import config from './env.js';

/**
 * CORS options object consumed by the `cors` middleware.
 *
 * @type {import('cors').CorsOptions}
 */
const corsOptions = {
  /**
   * Dynamic origin check — accepts requests only from the configured
   * CLIENT_URL.  Requests with no origin (e.g. server-to-server, curl)
   * are also allowed during development.
   */
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (origin === config.clientUrl) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },

  /** Allow cookies / Authorization header to be sent cross-origin. */
  credentials: true,

  /** Allowed HTTP methods. */
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  /** Headers the client may send. */
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],

  /** Headers the client may read from the response. */
  exposedHeaders: ['X-Total-Count'],

  /**
   * Cache the preflight response for 10 minutes so browsers don't send
   * an OPTIONS request before every actual request.
   */
  maxAge: 600,
};

export default corsOptions;
