import { Router } from 'express';

import authRoutes from './auth.routes.js';
import jobRoutes from './job.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);

export default router;