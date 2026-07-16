/**
 * @file src/validations/index.js
 * @description Barrel file for validation chain exports.
 *
 *   Each file in this directory exports arrays of express-validator chains
 *   that can be spread into route definitions.
 *
 *   Note: The existing `validators/` directory contains the auth validator
 *   created during initial setup.  New validation files should go here in
 *   `validations/` for consistency with the project structure spec.
 *
 *   As validators are created, re-export them here:
 *     export { registerValidator, loginValidator } from './auth.validation.js';
 */

// Re-export the existing auth validators
export { registerValidator, loginValidator } from '../validators/auth.validator.js';
