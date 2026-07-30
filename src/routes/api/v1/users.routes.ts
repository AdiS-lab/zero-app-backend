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
  .get(usersController.getById.bind(usersController))
  .put(validateTokenMiddleware, usersController.update.bind(usersController))
  .delete(
    validateTokenMiddleware,
    usersController.delete.bind(usersController)
  );

export default router;

// import express from 'express'
// import {createUser, logIn, forgotPassword, verifyEmail} from './user.controllers'

// const router = express.Router()

// // POST api/users/login
// router
//     .route('/login')
//     .post(logIn)

// // POST api/users/signup
// router
//     .route('/signup')
//     .post(createUser)

// // POST api/users/forgot-password
// router
//     .route('/forgot-password')
//     .post(forgotPassword)

// // POST api/users/verify-email
// router
//     .route('/verify-email')
//     .post(verifyEmail)

// export default router
