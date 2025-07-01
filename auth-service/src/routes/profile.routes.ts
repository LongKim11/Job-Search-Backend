import { Router } from 'express';
import multer from 'multer';
import profileController from './../controllers/profile.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/me', profileController.getProfile);
router.put('/update', profileController.updateProfile);
router.post('/avatar', upload.single('avatar'), profileController.updateAvatar);

export default router;
