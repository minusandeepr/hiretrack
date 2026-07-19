/**
 * @file src/validators/candidate.validator.js
 * @description Validation rules for Candidate CRUD.
 */

import { body } from 'express-validator';

export const createCandidateValidator = [
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),

    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required'),

    body('experience')
        .optional()
        .isNumeric()
        .withMessage('Experience must be a number'),

    body('skills')
        .optional(),

    body('status')
        .optional()
        .isIn([
            'Applied',
            'Screening',
            'Interview',
            'Selected',
            'Rejected',
        ])
        .withMessage('Invalid candidate status'),

    body('appliedJob')
        .notEmpty()
        .withMessage('Applied Job is required')
        .isMongoId()
        .withMessage('Invalid Job ID'),
];

export const updateCandidateValidator = [
    body('fullName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Full name cannot be empty'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required'),

    body('phone')
        .optional()
        .trim(),

    body('experience')
        .optional()
        .isNumeric()
        .withMessage('Experience must be a number'),

    body('skills')
        .optional(),


    body('status')
        .optional()
        .isIn([
            'Applied',
            'Screening',
            'Interview',
            'Selected',
            'Rejected',
        ])
        .withMessage('Invalid candidate status'),

    body('appliedJob')
        .optional()
        .isMongoId()
        .withMessage('Invalid Job ID'),
];