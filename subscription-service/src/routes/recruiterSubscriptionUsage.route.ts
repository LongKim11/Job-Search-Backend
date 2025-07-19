import { Router } from 'express';
import recruiterSubscriptionUsageController from '../controllers/recruiterSubscriptionUsage.controller';

const router = Router();

router.post('/', recruiterSubscriptionUsageController.create);
router.get('/:id', recruiterSubscriptionUsageController.getBySubscriptionId);
router.patch('/:id/status', recruiterSubscriptionUsageController.updateStatus);

export default router;
