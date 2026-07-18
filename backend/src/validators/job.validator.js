/**
 * @file src/validators/job.validator.js
 * @description express-validator validation chains for job routes.
 *
 *   Exported arrays can be spread directly into route definitions:
 *     router.post('/', ...createJobValidator, validate, createJob);
 *     router.put('/:id', ...updateJobValidator, validate, updateJob);
 */

import { body } from 'express-validator';

// ── Shared constants ────────────────────────────────────────────────────────
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const JOB_STATUSES = ['Open', 'Closed', 'Draft'];

// ── Create job validator ────────────────────────────────────────────────────
export const createJobValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be between 3 and 120 characters'),

  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),

  body('employmentType')
    .optional()
    .isIn(EMPLOYMENT_TYPES)
    .withMessage(`Employment type must be one of: ${EMPLOYMENT_TYPES.join(', ')}`),

  body('salaryMin')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error('Minimum salary must be at least 0');
      }
      return true;
    }),

  body('salaryMax')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((value, { req }) => {
      if (Number(value) < 0) {
        throw new Error('Maximum salary must be at least 0');
      }
      if (req.body.salaryMin != null && Number(value) < Number(req.body.salaryMin)) {
        throw new Error('Maximum salary must be greater than or equal to minimum salary');
      }
      return true;
    }),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),

  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array'),

  body('status')
    .optional()
    .isIn(JOB_STATUSES)
    .withMessage(`Status must be one of: ${JOB_STATUSES.join(', ')}`),
];

// ── Update job validator ────────────────────────────────────────────────────
export const updateJobValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be between 3 and 120 characters'),

  body('department')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Department cannot be empty'),

  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),

  body('employmentType')
    .optional()
    .isIn(EMPLOYMENT_TYPES)
    .withMessage(`Employment type must be one of: ${EMPLOYMENT_TYPES.join(', ')}`),

  body('salaryMin')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error('Minimum salary must be at least 0');
      }
      return true;
    }),

  body('salaryMax')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((value, { req }) => {
      if (Number(value) < 0) {
        throw new Error('Maximum salary must be at least 0');
      }
      if (req.body.salaryMin != null && Number(value) < Number(req.body.salaryMin)) {
        throw new Error('Maximum salary must be greater than or equal to minimum salary');
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),

  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array'),

  body('status')
    .optional()
    .isIn(JOB_STATUSES)
    .withMessage(`Status must be one of: ${JOB_STATUSES.join(', ')}`),
];
