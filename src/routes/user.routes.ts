import express from 'express' 
import userController from './user.controllers'

const router = express.Router()

// POST api/users/login
router
    .route('/login')
    .post(userController)

// POST api/users/signup
router
    .route('/signup')
    .post(userController)


// POST api/users/forgot-password
router
    .route('/forgot-password')
    .post(userController)

    
// POST api/users/verify-email
router
    .route('/verify-email')
    .post(userController)
    
export default router