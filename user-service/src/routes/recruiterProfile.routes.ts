import { Router } from 'express';
import recruiterProfileController from '../controllers/recruiterProfile.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/recruiter', recruiterProfileController.getAll);
router.get('/recruiter/:id', recruiterProfileController.getById);
router.post('/recruiter', recruiterProfileController.create);
router.put(
  '/recruiter/business-license',
  upload.single('businesslicense'),
  recruiterProfileController.updateBussinessLicense
);
router.put('/recruiter/:id', recruiterProfileController.update);
router.delete('/recruiter/:id', recruiterProfileController.remove);

export default router;
