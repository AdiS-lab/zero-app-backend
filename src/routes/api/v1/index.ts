import { Router } from 'express';

import usersRoutes from './users.routes';
import authRoutes from './auth.routes';
import chatsRoutes from './chats.routes';
import chatroomsRoutes from './chatrooms.routes';

const router = Router();

// use other routes here
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/chats', chatsRoutes);
router.use('/chatrooms', chatroomsRoutes);

export default router;
