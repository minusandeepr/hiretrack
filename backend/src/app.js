/**
 * @file src/app.js
 * @description Express application factory.
 *
 *   Creates and configures the Express app with all middleware:
 *   – CORS, JSON body parsing, cookie parsing, HTTP logging
 *   – API routes mounted at /api
 *   – 404 catch-all and global error handler
 *
 *   The app is exported WITHOUT calling .listen() so it can be used
 *   in tests without binding to a port.
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import corsOptions from './config/cors.js';
import config from './config/env.js';
import ApiError from './utils/ApiError.js';
import routes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import geminiRoutes from "./routes/gemini.routes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Create app ──────────────────────────────────────────────────────────────
const app = express();

// ── Global middleware ───────────────────────────────────────────────────────

/** CORS — only the configured CLIENT_URL is whitelisted. */
app.use(cors(corsOptions));

/** Parse incoming JSON payloads (limit to 5 MB). */
app.use(express.json({ limit: '5mb' }));

/** Parse URL-encoded bodies (form submissions). */
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

/** Parse cookies (needed for refresh-token cookie). */
app.use(cookieParser());

/** HTTP request logger — 'dev' format for development, 'combined' for prod. */
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));
}

app.use("/api/gemini", geminiRoutes);
// ── Health-check endpoint ───────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'HireTrack API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ──────────────────────────────────────────────────────────────

app.use('/api', routes);
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);


// ── 404 catch-all ───────────────────────────────────────────────────────────
app.all('*', (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

// ── Global error handler ────────────────────────────────────────────────────
/**
 * Express error-handling middleware (4-argument signature).
 *
 * Operational errors (ApiError with isOperational=true) return structured
 * JSON.  Unexpected errors log the full stack and return a generic 500.
 */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  // Log unexpected (non-operational) errors
  if (!err.isOperational) {
    console.error('💥  UNEXPECTED ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    status,
    message: err.message || 'Internal server error',
    ...(err.code && { code: err.code }),
    // Include stack trace only in development
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

export default app;
