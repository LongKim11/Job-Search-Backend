import { Router } from 'express';
import subscriptionPlanController from '../controllers/subscriptionPlan.controller';

const router = Router();

router.get('/', subscriptionPlanController.getAll);
router.post('/', subscriptionPlanController.create);
router.put('/:id', subscriptionPlanController.update);
router.patch('/:id/toggle-active', subscriptionPlanController.toggleActive);

export default router;
