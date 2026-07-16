/**
 * @file src/routes/index.js
 * @description Central route registrar.
 *
 *   Mounts all domain-specific routers under a single Express Router instance.
 *   app.js imports this file and mounts it at `/api`.
 *
 *   Example (uncomment as routes are created):
 *     router.use('/auth',       authRoutes);
 *     router.use('/jobs',       jobRoutes);
 *     router.use('/candidates', candidateRoutes);
 */

import { Router } from 'express';

const router = Router();

// ── Mount domain routers here ───────────────────────────────────────────────
import authRoutes from './auth.routes.js';
router.use('/auth', authRoutes);

// import jobRoutes from './job.routes.js';
// router.use('/jobs', jobRoutes);

// import candidateRoutes from './candidate.routes.js';
// router.use('/candidates', candidateRoutes);

export default router;
