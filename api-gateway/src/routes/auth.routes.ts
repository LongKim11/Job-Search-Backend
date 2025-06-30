import { Router } from 'express';
import { authProxy } from '../proxy/auth.proxy';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// router.use(authMiddleware);
router.use('/', authProxy);

export default router;
