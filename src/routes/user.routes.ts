import express from 'express' 
import {createUser, logIn, forgotPassword, verifyEmail} from './user.controllers'

const router = express.Router()

// POST api/users/login
router
    .route('/login')
    .post(logIn)

// POST api/users/signup
router
    .route('/signup')
    .post(createUser)


// POST api/users/forgot-password
router
    .route('/forgot-password')
    .post(forgotPassword)

    
// POST api/users/verify-email
router
    .route('/verify-email')
    .post(verifyEmail)
    
export default router