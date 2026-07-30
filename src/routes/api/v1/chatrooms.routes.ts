import { Router } from 'express';

import { chatroomsController } from '../../../controllers';

// import validateTokenMiddleware from '../../../middleware/validate-token.middleware';

const router = Router();

// router.use(validateTokenMiddleware);

router
  .route('/')
  .get(chatroomsController.list.bind(chatroomsController))
  .post(chatroomsController.createRoom.bind(chatroomsController));

router
  .route('/:_id')
  .get(chatroomsController.getById.bind(chatroomsController))
  .put(chatroomsController.update.bind(chatroomsController))
  .delete(chatroomsController.delete.bind(chatroomsController));

export default router;
