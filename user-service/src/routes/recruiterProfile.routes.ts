import { Router } from 'express';
import recruiterProfileController from '../controllers/recruiterProfile.controller';

const router = Router();

router.get('/', recruiterProfileController.getAll);
router.get('/:id', recruiterProfileController.getById);
router.post('/', recruiterProfileController.create);
router.put('/:id', recruiterProfileController.update);
router.delete('/:id', recruiterProfileController.remove);

export default router;
