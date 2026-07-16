/**
 * @file src/config/env.js
 * @description Loads environment variables from .env and exports a frozen
 *   configuration object.  Throws immediately if any required variable is
 *   missing so the server never starts in an invalid state.
 */

import dotenv from 'dotenv';

// Load .env file from project root (one level above src/)
dotenv.config();

// ── Required variables ──────────────────────────────────────────────────────
const REQUIRED_VARS = [
  'PORT',
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'CLIENT_URL',
];

/**
 * Validate that every required env var is present and non-empty.
 * Collects ALL missing vars before throwing so the developer can fix them
 * in a single pass.
 */
const missing = REQUIRED_VARS.filter(
  (key) => !process.env[key] || process.env[key].trim() === '',
);

if (missing.length > 0) {
  throw new Error(
    `❌  Missing required environment variables:\n` +
      missing.map((v) => `   • ${v}`).join('\n') +
      `\n\nCopy .env.example to .env and fill in the values.`,
  );
}

// ── Exported config (frozen to prevent accidental mutation) ──────────────────
const config = Object.freeze({
  /** Server port */
  port: parseInt(process.env.PORT, 10) || 5000,

  /** Current environment */
  nodeEnv: process.env.NODE_ENV || 'development',

  /** MongoDB connection string */
  mongodbUri: process.env.MONGODB_URI,

  /** JWT access-token secret */
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,

  /** JWT refresh-token secret */
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,

  /** JWT access-token lifetime (e.g. "15m") */
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,

  /** JWT refresh-token lifetime (e.g. "7d") */
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

  /** Front-end URL used for CORS origin */
  clientUrl: process.env.CLIENT_URL,

  /** Helper — true when NODE_ENV === 'production' */
  get isProduction() {
    return this.nodeEnv === 'production';
  },
});

export default config;
