import { Router } from 'express';
import roleController from '../controllers/role.controller';

const router = Router();

router.get('/role', roleController.getAllRoles);
router.get('/role/:id', roleController.getRoleById);
router.post('/role', roleController.createRole);
router.put('/role/:id', roleController.updateRole);
router.delete('role/:id', roleController.deleteRole);

export default router;
