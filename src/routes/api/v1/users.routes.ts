import { Router } from 'express';

import { usersController } from '../../../controllers';

import validateTokenMiddleware from '../../../middleware/validate-token.middleware';

const router = Router();

router
  .route('/')
  .get(usersController.list.bind(usersController))
  .post(validateTokenMiddleware, usersController.create.bind(usersController));

router
  .route('/:_id')
  .put(validateTokenMiddleware, usersController.update.bind(usersController))
  .delete(
    validateTokenMiddleware,
    usersController.delete.bind(usersController)
  );

router
  .route('/any-user')
  .post(usersController.getUserByEmail.bind(usersController));
export default router;
