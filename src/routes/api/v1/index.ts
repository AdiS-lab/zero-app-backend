import { Router } from "express";

import usersRoutes from "./users.routes";

const router = Router();

// use other routes here
router.use("/users", usersRoutes);

export default router;
