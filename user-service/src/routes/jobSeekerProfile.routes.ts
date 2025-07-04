import { Router } from 'express';
import jobSeekerProfileController from '../controllers/jobSeekerProfile.controller';

const router = Router();

router.get('/', jobSeekerProfileController.getAll);
router.get('/:id', jobSeekerProfileController.getById);
router.post('/', jobSeekerProfileController.create);
router.put('/:id', jobSeekerProfileController.update);
router.delete('/:id', jobSeekerProfileController.remove);

export default router;
