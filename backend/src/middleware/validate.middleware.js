/**
 * @file src/middleware/validate.middleware.js
 * @description Middleware that inspects the results of express-validator
 *   validation chains.  If any errors are present, it short-circuits the
 *   request with a 400 response containing a structured error payload.
 *
 *   Usage — place it right after the validator array in the route definition:
 *     router.post('/register', ...registerValidator, validate, registerCtrl);
 */

import { validationResult } from 'express-validator';

/**
 * Check for validation errors and return 400 if any exist.
 *
 * Response shape on failure:
 * {
 *   success: false,
 *   message: "Validation failed",
 *   errors: [
 *     { field: "email", message: "Please provide a valid email address" },
 *     …
 *   ]
 * }
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Map to a friendlier shape — `param` becomes `field`.
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  return next();
};

export default validate;
