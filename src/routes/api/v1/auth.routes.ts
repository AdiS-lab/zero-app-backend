import { Router } from 'express';

import { authController } from '../../../controllers';
import validateTokenMiddleware from '../../../middleware/validate-token.middleware';

const router = Router();

// router
//   .route('/refresh')
//   .put(validateTokenMiddleware, authController.refresh.bind(authController));

router.route('/signup').post(authController.signup.bind(authController));

router.route('/login').post(authController.login.bind(authController));

router
  .route('/me')
  .get(validateTokenMiddleware, authController.me.bind(authController));

router
  .route('/logout')
  .post(validateTokenMiddleware, authController.logout.bind(authController));

// router
//   .route('/forgot-password')
//   .post(authController.forgotPassword.bind(authController));

// router
//   .route('/verify-email')
// .post(authController.verifyEmail.bind(authController));

export default router;
