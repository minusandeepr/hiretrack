/**
 * @file src/server.js
 * @description Application entry point.
 *
 *   1. Connects to MongoDB via the connectDB helper.
 *   2. Starts the Express HTTP server on the configured PORT.
 *   3. Listens for SIGINT / SIGTERM and performs a graceful shutdown
 *      (closes the HTTP server, then disconnects Mongoose).
 */

import mongoose from 'mongoose';
import app from './app.js';
import config from './config/env.js';
import connectDB from './config/db.js';

// ── Boot sequence ───────────────────────────────────────────────────────────

const startServer = async () => {
  // 1 — Connect to MongoDB
  await connectDB();

  // 2 — Start HTTP server
  const server = app.listen(config.port, () => {
    console.log(
      `\n🚀  HireTrack API running on http://localhost:${config.port}` +
      `  [${config.nodeEnv}]\n`,
    );
  });

  // ── Graceful shutdown ───────────────────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`\n⏳  ${signal} received — shutting down gracefully …`);

    server.close(async () => {
      console.log('✅  HTTP server closed');

      try {
        await mongoose.connection.close();
        console.log('✅  MongoDB connection closed');
      } catch (err) {
        console.error('❌  Error closing MongoDB connection:', err.message);
      }

      process.exit(0);
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Catch unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('💥  Unhandled Rejection:', err);
    shutdown('UNHANDLED_REJECTION');
  });
};

startServer();
