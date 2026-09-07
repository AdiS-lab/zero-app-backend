import { Router } from 'express';
import multer from 'multer';

import { usersController } from '../../../controllers';
import validateTokenMiddleware from '../../../middleware/validate-token.middleware';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router
  .route('/')
  .get(usersController.list.bind(usersController))
  .post(validateTokenMiddleware, usersController.create.bind(usersController));

router
  .route('/by-email')
  .post(usersController.getUserByEmail.bind(usersController));

router
  .route('/update-avatar')
  .post(
    validateTokenMiddleware,
    upload.single('profileImage'),
    usersController.updateAvatar.bind(usersController)
  );

router
  .route('/:_id')
  .put(validateTokenMiddleware, usersController.update.bind(usersController))
  .delete(
    validateTokenMiddleware,
    usersController.delete.bind(usersController)
  );
export default router;
