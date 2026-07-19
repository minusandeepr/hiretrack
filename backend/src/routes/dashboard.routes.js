/**
 * @file src/routes/dashboard.routes.js
 * @description Routes for Dashboard statistics.
 */

import express from 'express';

import { getDashboardStats } from '../controllers/dashboard.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * GET /api/dashboard/stats
 */
router.get('/stats', protect, getDashboardStats);

export default router;