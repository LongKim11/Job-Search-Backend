import { Router } from 'express';
import authController from './../controllers/auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/send-verification', authController.resendVerificationCode);
router.post('/verify', authController.verifyEmail);
router.post('/logout', authController.logout);
router.post('/change-password', authController.changePassword);

export default router;
