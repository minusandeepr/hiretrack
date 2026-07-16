/**
 * @file src/validators/auth.validator.js
 * @description express-validator validation chains for authentication routes.
 *
 *   Exported arrays can be spread directly into route definitions:
 *     router.post('/register', ...registerValidator, validate, register);
 *
 *   Password policy:
 *     • Minimum 8 characters
 *     • At least 1 uppercase letter
 *     • At least 1 digit
 *     • At least 1 special character (!@#$%^&* etc.)
 */

import { body } from 'express-validator';

// ── Register validator ──────────────────────────────────────────────────────
export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
];

// ── Login validator ─────────────────────────────────────────────────────────
export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];
