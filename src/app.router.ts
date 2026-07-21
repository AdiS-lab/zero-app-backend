import { Router } from 'express';

import apiRoutes from './routes/api';

const router = Router();

router.use('/api', apiRoutes);
// router.use("/upload", )
// router.use("/redirect", )

export default router;
