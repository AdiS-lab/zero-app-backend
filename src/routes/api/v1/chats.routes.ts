import { Router } from 'express';

import { chatsController } from '../../../controllers';

import validateTokenMiddleware from '../../../middleware/validate-token.middleware';

const router = Router();

router.use(validateTokenMiddleware);

router
  .route('/')
  .get(chatsController.list.bind(chatsController))
  .post(chatsController.create.bind(chatsController));

router
  .route('/:_id')
  .get(chatsController.getById.bind(chatsController))
  .put(validateTokenMiddleware, chatsController.update.bind(chatsController))
  .delete(
    validateTokenMiddleware,
    chatsController.delete.bind(chatsController)
  );

export default router;
