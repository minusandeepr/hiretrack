/**
 * @file src/routes/candidate.routes.js
 * @description Routes for Candidate CRUD operations.
 */

import express from 'express';

import {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
} from '../controllers/candidate.controller.js';

import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';

import {
    createCandidateValidator,
    updateCandidateValidator,
} from '../validators/candidate.validator.js';
import upload from '../middleware/upload.middleware.js';


const router = express.Router();

/**
 * GET /api/candidates
 */
router.get('/', protect, getAllCandidates);

/**
 * GET /api/candidates/:id
 */
router.get('/:id', protect, getCandidateById);
/** 
 * PUT /api/candidates/:id
 */
router.put(
    '/:id',
    protect,
    ...updateCandidateValidator,
    validate,
    updateCandidate
);

/**
 * DELETE /api/candidates/:id
 */
router.delete('/:id', protect, deleteCandidate);
router.post(
    '/',
    protect,
    upload.single('resume'),
    ...createCandidateValidator,
    validate,
    createCandidate
);

export default router;