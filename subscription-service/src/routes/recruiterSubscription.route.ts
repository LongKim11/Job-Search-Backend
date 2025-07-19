import { Router } from 'express';
import recruiterSubscriptionController from '../controllers/recruiterSubscription.controller';

const router = Router();

// For recruiter (via X-Header-Id)
router.get('/', recruiterSubscriptionController.getAllByRecruiter);

// For admin
router.get('/all', recruiterSubscriptionController.getAll);
router.get(
  '/recruiter/:recruiterId',
  recruiterSubscriptionController.getByRecruiterId
);

router.post('/', recruiterSubscriptionController.create);
router.patch('/:id/cancel', recruiterSubscriptionController.cancel);

export default router;
