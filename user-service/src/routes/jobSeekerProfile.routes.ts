import { Router } from 'express';
import jobSeekerProfileController from '../controllers/jobSeekerProfile.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/job-seeker', jobSeekerProfileController.getAll);
router.get('/job-seeker/:id', jobSeekerProfileController.getById);
router.post('/job-seeker', jobSeekerProfileController.create);
router.put(
  '/job-seeker',
  upload.single('resume'),
  jobSeekerProfileController.update
);
router.delete('/job-seeker:id', jobSeekerProfileController.remove);

export default router;
