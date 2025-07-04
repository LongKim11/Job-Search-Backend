import { Router } from 'express';
import { createJob, getJobs } from '../controllers/job.controller';

const router = Router();

router.post('/', createJob);
router.get('/', getJobs);

export default router;
