/**
 * @file src/config/db.js
 * @description Mongoose connection helper with automatic retry logic.
 *   Retries up to 3 times using exponential back-off (1 s → 2 s → 4 s)
 *   before giving up and exiting the process.
 */

import mongoose from 'mongoose';
import config from './env.js';

/** Maximum number of connection attempts before we abort. */
const MAX_RETRIES = 3;

/** Base delay between retries in milliseconds. */
const BASE_DELAY_MS = 1000;

/**
 * Connect to MongoDB with retry logic.
 *
 * On each failed attempt the delay doubles (exponential back-off).
 * After exhausting all retries the process exits with code 1 so the
 * orchestrator / process-manager can restart it if desired.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(config.mongodbUri, {
        // Mongoose 8 uses the new connection-string parser and unified
        // topology by default — no extra options required.
      });

      console.log(
        `✅  MongoDB connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`,
      );

      // ── Connection event listeners ──────────────────────────────────────
      mongoose.connection.on('error', (err) => {
        console.error('❌  MongoDB connection error:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });

      return; // Success — exit the retry loop.
    } catch (err) {
      console.error(
        `❌  MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`,
      );

      if (attempt === MAX_RETRIES) {
        console.error(
          '💀  All MongoDB connection attempts exhausted — shutting down.',
        );
        process.exit(1);
      }

      // Exponential back-off: 1 s, 2 s, 4 s …
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`⏳  Retrying in ${delay / 1000}s …`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;
