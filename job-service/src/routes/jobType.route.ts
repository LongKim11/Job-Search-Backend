import { Router } from 'express';
import jobTypeController from '../controllers/jobType.controller';

const router = Router();

router.get('/', jobTypeController.getAll);
router.post('/', jobTypeController.create);
router.post('/bulk', jobTypeController.bulkCreate);
router.put('/:id', jobTypeController.update);
router.patch('/:id/toggle-active', jobTypeController.toggleActive);

export default router;