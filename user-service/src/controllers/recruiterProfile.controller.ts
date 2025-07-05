import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/apiReponose';
import recruiterProfileService from '../services/recruiterProfile.service';

const recruiterProfileController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await recruiterProfileService.getAll();
      res.json(successResponse('Fetched all recruiter profiles', data));
    } catch (err: any) {
      res.status(500).json(errorResponse(err.message));
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const data = await recruiterProfileService.getById(req.params.id);
      res.json(successResponse('Fetched recruiter profile', data));
    } catch (err: any) {
      res.status(404).json(errorResponse(err.message));
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const userId = req.header('X-User-Id');
      if (userId) {
        const profile = await recruiterProfileService.create({
          ...req.body,
          account_id: userId,
        });
        res
          .status(201)
          .json(successResponse('Created recruiter profile', profile));
      } else {
        res.status(400).json(errorResponse('User ID is required'));
      }
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const profile = await recruiterProfileService.update(
        req.params.id,
        req.body
      );
      res.json(successResponse('Updated recruiter profile', profile));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  updateBussinessLicense: async (req: Request, res: Response) => {
    try {
      const userId = req.header('X-User-Id');
      const business_license_url =
        await recruiterProfileService.updateBussinessLicense(userId!, req);
      res.status(200).json(
        successResponse('Bussiness license updated successfully', {
          business_license_url,
        })
      );
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      await recruiterProfileService.remove(req.params.id);
      res.json(successResponse('Deleted recruiter profile'));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default recruiterProfileController;
