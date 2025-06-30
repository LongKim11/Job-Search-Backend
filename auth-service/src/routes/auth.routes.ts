import { Router } from 'express';
import authController from './../controllers/auth.controller';

const router = Router();

// Register new account
router.post('/register', authController.register);

// Login and get tokens
router.post('/login', authController.login);

// Refresh access and refresh tokens
router.post('/refresh', authController.refreshToken);

// Send verification code to email
router.post('/send-verification', authController.resendVerificationCode);

// Verify account with verification code
router.post('/verify', authController.verifyEmail);

// Logout and invalidate refresh token
router.post('/logout', authController.logout);

export default router;
