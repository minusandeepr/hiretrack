/**
 * @file src/utils/asyncHandler.js
 * @description Higher-order function that wraps an async Express route handler
 *   so that any rejected promise is automatically forwarded to the next error
 *   middleware via `next(err)`.
 *
 *   Usage:
 *     router.get('/resource', asyncHandler(async (req, res) => { … }));
 *
 *   Without this wrapper every async handler would need its own try/catch
 *   block — this keeps controllers clean and DRY.
 */

/**
 * Wrap an async route handler to catch errors.
 *
 * @param {Function} fn — An async function with signature (req, res, next).
 * @returns {Function}  — An Express-compatible middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
