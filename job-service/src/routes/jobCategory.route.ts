import { Router } from 'express';
import { jobCategoryController } from '../controllers/jobCategory.controller';

const router = Router();

router.post('/', jobCategoryController.add);
router.post('/bulk', jobCategoryController.bulkAdd);
router.get('/', jobCategoryController.getAll);
router.put('/:id', jobCategoryController.update);
router.patch('/:id/toggle-active', jobCategoryController.toggleIsActive);

export default router;
