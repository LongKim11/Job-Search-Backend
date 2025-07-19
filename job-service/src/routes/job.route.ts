import { Router } from 'express';
import jobController from '../controllers/job.controller';

const router = Router();

// Admin
router.get('/all', jobController.getAll);
router.patch('/:slug/status', jobController.updateStatus);

// Public get detail
router.get('/:slug', jobController.getDetail);

// Recruiter
router.get('/', jobController.getByRecruiter);
router.post('/', jobController.create);
router.put('/:slug', jobController.update);

export default router;
