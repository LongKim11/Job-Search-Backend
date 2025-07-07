import { Request, Response } from 'express';
import cityService from '../services/city.service';
import { successResponse, errorResponse } from '../utils/apiReponose';

const cityController = {
  getAllCities: async (req: Request, res: Response) => {
    try {
      const { isActive, page, limit, noPage, includeDistricts } = req.query;
      const result = await cityService.getAllCities({
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        page: noPage === 'true' ? undefined : page ? parseInt(page as string) : undefined,
        limit: noPage === 'true' ? undefined : limit ? parseInt(limit as string) : undefined,
        includeDistricts: includeDistricts === 'false' ? false : true,
      });
      res.status(200).json(successResponse('Cities fetched successfully', result));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  getDistrictsByCity: async (req: Request, res: Response) => {
    try {
      const { isActive } = req.query;
      const districts = await cityService.getDistrictsByCity(
        req.params.cityId,
        isActive === 'true' ? true : isActive === 'false' ? false : undefined
      );
      res.status(200).json(successResponse('Districts fetched successfully', districts));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },


  createCity: async (req: Request, res: Response) => {
    try {
      const city = await cityService.createCity(req.body);
      res.status(201).json(successResponse('City created successfully', city));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  bulkCreateCities: async (req: Request, res: Response) => {
    try {
      const result = await cityService.bulkCreateCities(req.body);
      res.status(201).json(successResponse('Cities created successfully', result));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  updateCity: async (req: Request, res: Response) => {
    const { cityId } = req.params;
    try {
      const city = await cityService.updateCity(cityId, req.body);
      res.status(200).json(successResponse('City updated successfully', city));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  toggleCityActive: async (req: Request, res: Response) => {
    const { cityId } = req.params;
    try {
      const city = await cityService.toggleCityActive(cityId);
      res.status(200).json(successResponse('City active state toggled', city));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  addDistrict: async (req: Request, res: Response) => {
    const { cityId } = req.params;
    const { name } = req.body;
    try {
      const district = await cityService.addDistrict(cityId, name);
      res.status(201).json(successResponse('District added successfully', district));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  updateDistrict: async (req: Request, res: Response) => {
    const { cityId, districtId } = req.params;
    try {
      const updated = await cityService.updateDistrict(cityId, districtId, req.body);
      res.status(200).json(successResponse('District updated successfully', updated));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  toggleDistrictActive: async (req: Request, res: Response) => {
    const { cityId, districtId } = req.params;
    try {
      const district = await cityService.toggleDistrictActive(cityId, districtId);
      res.status(200).json(successResponse('District active state toggled', district));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default cityController;