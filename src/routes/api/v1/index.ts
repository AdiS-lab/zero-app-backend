import { Router } from 'express';

import usersRoutes from './users.routes';
import authRoutes from './auth.routes';

const router = Router();

// use other routes here
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);

export default router;
