import { Router } from "express";

import { authController } from "../../../controllers";
import { authMiddleware } from '../../../middleware/validateToken'

const router = Router()

router
    .route('/refresh')
    .put(authMiddleware, authController.refresh.bind(authController))

router
  .route("/signup")
  .post(authController.signup.bind(authController))

router
    .route("/login")
    .post(authController.login.bind(authController))

router
    .route("/logout")
    .post(authMiddleware, authController.logout.bind(authController))

router
    .route("/forgot-password")
    .post(authController.forgotPassword.bind(authController))

router
    .route("/verify-email")
    .post(authController.verifyEmail.bind(authController))


export default router