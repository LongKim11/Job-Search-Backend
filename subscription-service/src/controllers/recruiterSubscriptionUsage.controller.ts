import { Request, Response } from 'express';
import recruiterSubscriptionUsageService from '../services/recruiterSubscriptionUsage.service';
import { successResponse, errorResponse } from '../utils/apiReponose';

const recruiterSubscriptionUsageController = {
  create: async (req: Request, res: Response) => {
    try {
      const { recruiter_subscription_id, post_id, post_type, status } =
        req.body;
      const usage = await recruiterSubscriptionUsageService.create({
        recruiter_subscription_id,
        post_id,
        post_type,
        status,
      });

      res
        .status(201)
        .json(successResponse('Usage created successfully', usage));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  getBySubscriptionId: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const usages =
        await recruiterSubscriptionUsageService.getByRecruiterSubscriptionId(
          id
        );
      res.status(200).json(successResponse('Usages fetched', usages));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await recruiterSubscriptionUsageService.updateStatus(
        id,
        status
      );
      res.status(200).json(successResponse('Status updated', updated));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default recruiterSubscriptionUsageController;
