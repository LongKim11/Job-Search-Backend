import express from 'express';
import cityController from '../controllers/city.controller';

const router = express.Router();

router.get('/', cityController.getAllCities);
router.post('/', cityController.createCity);
router.post('/bulk', cityController.bulkCreateCities);
router.put('/:cityId', cityController.updateCity);
router.patch('/:cityId/toggle', cityController.toggleCityActive);

router.get('/:cityId/districts', cityController.getDistrictsByCity);
router.post('/:cityId/districts', cityController.addDistrict);
router.put('/:cityId/districts/:districtId', cityController.updateDistrict);
router.patch('/:cityId/districts/:districtId/toggle', cityController.toggleDistrictActive);

export default router;