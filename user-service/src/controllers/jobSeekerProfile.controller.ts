import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/apiReponose';
import jobSeekerProfileService from '../services/jobSeekerProfile.service';

const jobSeekerProfileController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await jobSeekerProfileService.getAll();
      res.json(successResponse('Fetched all job seeker profiles', data));
    } catch (err: any) {
      res.status(500).json(errorResponse(err.message));
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const data = await jobSeekerProfileService.getById(req.params.id);
      res.json(successResponse('Fetched job seeker profile', data));
    } catch (err: any) {
      res.status(404).json(errorResponse(err.message));
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const profile = await jobSeekerProfileService.create(req.body);
      res
        .status(201)
        .json(successResponse('Created job seeker profile', profile));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const userId = req.header('X-User-Id');
      const resume_url = await jobSeekerProfileService.update(userId!, req);
      res
        .status(200)
        .json(successResponse('Resume updated successfully', { resume_url }));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      await jobSeekerProfileService.remove(req.params.id);
      res.json(successResponse('Deleted job seeker profile'));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default jobSeekerProfileController;
