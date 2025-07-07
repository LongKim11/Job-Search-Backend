import { Request, Response } from 'express';
import { jobCategoryService } from '../services/jobCategory.service';
import { successResponse, errorResponse } from '../utils/apiReponose';

export const jobCategoryController = {
  add: async (req: Request, res: Response) => {
    try {
      const result = await jobCategoryService.add(req.body);
      res.status(201).json(successResponse('Job category created successfully', result));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  bulkAdd: async (req: Request, res: Response) => {
    try {
      const result = await jobCategoryService.bulkAdd(req.body);
      res.status(201).json(successResponse('Bulk job categories created successfully', result));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const { isActive, page, limit, noPage } = req.query;

      const result = await jobCategoryService.getAll({
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        noPage: noPage === 'true',
      });

      res.status(200).json(successResponse('Job categories fetched successfully', result));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const result = await jobCategoryService.update(req.params.id, req.body);
      res.status(200).json(successResponse('Job category updated successfully', result));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  toggleIsActive: async (req: Request, res: Response) => {
    try {
      const result = await jobCategoryService.toggleIsActive(req.params.id);
      res.status(200).json(successResponse('Job category active status toggled', result));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};
