import { Request, Response } from 'express';
import jobService from '../services/job.service';
import { successResponse, errorResponse } from '../utils/apiReponose';

const jobController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        location_name,
        workplace_type,
        recruiter_profile_id,
      } = req.query;
      const data = await jobService.getAll({
        page: Number(page),
        limit: Number(limit),
        status: status as string | undefined,
        location_name: location_name as string | undefined,
        workplace_type: workplace_type as string | undefined,
        recruiter_profile_id: recruiter_profile_id as string | undefined,
      });

      res.status(200).json(successResponse('All jobs', data));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  getByRecruiter: async (req: Request, res: Response) => {
    try {
      const recruiterId = req.header('X-Header-Id');
      if (!recruiterId) throw new Error('Missing recruiter ID');

      const { page = 1, limit = 10, status } = req.query;

      const data = await jobService.getByRecruiter({
        recruiterId: recruiterId as string,
        page: Number(page),
        limit: Number(limit),
        status: status as string | undefined,
      });

      res.status(200).json(successResponse('Jobs by recruiter', data));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const data = await jobService.getDetail(slug);

      res.status(200).json(successResponse('Job detail', data));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const recruiterId = req.header('X-Header-Id');
      if (!recruiterId) throw new Error('Missing recruiter ID');

      const job = await jobService.create({
        ...req.body,
        recruiter_profile_id: recruiterId,
      });

      res.status(201).json(successResponse('Job created successfully', job));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updated = await jobService.update(req.params.slug, req.body);
      res.status(200).json(successResponse('Job updated', updated));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const updated = await jobService.updateStatus(req.params.slug, status);
      res.status(200).json(successResponse('Job status updated', updated));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default jobController;
