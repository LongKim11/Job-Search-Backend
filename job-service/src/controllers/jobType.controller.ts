import { Request, Response } from 'express';
import jobTypeService from '../services/jobType.service';
import { successResponse, errorResponse } from '../utils/apiReponose';

const jobTypeController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { isActive, page, limit, noPage } = req.query;
      const result = await jobTypeService.getAll({
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        noPage: noPage === 'true',
      });
      res.status(200).json(successResponse('Job types fetched successfully', result));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const jobType = await jobTypeService.create(req.body);
      res.status(201).json(successResponse('Job type created successfully', jobType));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  bulkCreate: async (req: Request, res: Response) => {
    try {
      const jobTypes = await jobTypeService.bulkCreate(req.body);
      res.status(201).json(successResponse('Job types created successfully', jobTypes));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updated = await jobTypeService.update(req.params.id, req.body);
      res.status(200).json(successResponse('Job type updated successfully', updated));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  toggleActive: async (req: Request, res: Response) => {
    try {
      const updated = await jobTypeService.toggleActive(req.params.id);
      res.status(200).json(successResponse('Job type status toggled', updated));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default jobTypeController;
