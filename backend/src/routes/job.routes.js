/**
 * @file src/routes/job.routes.js
 * @description Routes for Job CRUD operations.
 */

import express from 'express';
console.log('✅ job.routes.js loaded');

import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from '../controllers/job.controller.js';

import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';

import {
  createJobValidator,
  updateJobValidator,
} from '../validators/job.validator.js';

const router = express.Router();

/**
 * GET /api/jobs
 * Get all jobs
 */
router.get('/', protect, getAllJobs);

/**
 * GET /api/jobs/:id
 * Get single job
 */
router.get('/:id', protect, getJobById);

/**
 * POST /api/jobs
 * Create job
 */
router.post(
  '/',
  protect,
  ...createJobValidator,
  validate,
  createJob
);

/**
 * PUT /api/jobs/:id
 * Update job
 */
router.put(
  '/:id',
  protect,
  ...updateJobValidator,
  validate,
  updateJob
);

/**
 * DELETE /api/jobs/:id
 * Delete job
 */
router.delete('/:id', protect, deleteJob);

export default router;