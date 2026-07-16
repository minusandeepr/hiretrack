/**
 * @file src/utils/ApiError.js
 * @description Custom operational error class used throughout the application.
 *   Provides static factory methods for the most common HTTP error statuses
 *   so controllers and services can throw descriptive errors without
 *   hard-coding status codes.
 *
 *   All ApiError instances are marked `isOperational = true` so the global
 *   error handler can distinguish expected errors (bad input, auth failures)
 *   from unexpected programming errors.
 */

class ApiError extends Error {
  /**
   * @param {number}  statusCode  — HTTP status code (e.g. 400, 401, 404).
   * @param {string}  message     — Human-readable error description.
   * @param {string}  [code]      — Optional machine-readable error code
   *                                 (e.g. "DUPLICATE_EMAIL").
   * @param {boolean} [isOperational=true] — Flag for the global error handler.
   */
  constructor(statusCode, message, code = undefined, isOperational = true) {
    super(message);

    /** HTTP status code */
    this.statusCode = statusCode;

    /**
     * Shorthand status label derived from the status code.
     * 4xx → "fail" (client error), 5xx → "error" (server error).
     */
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

    /** Machine-readable error code for front-end consumption. */
    this.code = code;

    /**
     * Operational errors are expected (e.g. invalid input).
     * Programming errors are NOT operational and may need alerting.
     */
    this.isOperational = isOperational;

    // Capture stack trace, excluding the constructor call itself.
    Error.captureStackTrace(this, this.constructor);
  }

  // ── Static factory methods ──────────────────────────────────────────────

  /**
   * 400 Bad Request — the client sent invalid or malformed data.
   * @param {string} message
   * @param {string} [code]
   * @returns {ApiError}
   */
  static badRequest(message = 'Bad request', code) {
    return new ApiError(400, message, code);
  }

  /**
   * 401 Unauthorized — missing or invalid authentication.
   * @param {string} message
   * @param {string} [code]
   * @returns {ApiError}
   */
  static unauthorized(message = 'Unauthorized', code) {
    return new ApiError(401, message, code);
  }

  /**
   * 403 Forbidden — authenticated but lacking permission.
   * @param {string} message
   * @param {string} [code]
   * @returns {ApiError}
   */
  static forbidden(message = 'Forbidden', code) {
    return new ApiError(403, message, code);
  }

  /**
   * 404 Not Found — the requested resource does not exist.
   * @param {string} message
   * @param {string} [code]
   * @returns {ApiError}
   */
  static notFound(message = 'Resource not found', code) {
    return new ApiError(404, message, code);
  }

  /**
   * 409 Conflict — duplicate resource or state conflict.
   * @param {string} message
   * @param {string} [code]
   * @returns {ApiError}
   */
  static conflict(message = 'Resource already exists', code) {
    return new ApiError(409, message, code);
  }
}

export default ApiError;
