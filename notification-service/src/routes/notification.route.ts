import { Router } from 'express';
import notificationController from '../controllers/notification.controller';

const router = Router();

router.post('/email', (req, res, next) => {
  notificationController.sendEmail(req, res).catch(next);
});

export default router;
