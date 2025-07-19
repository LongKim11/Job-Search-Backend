import { Request, Response } from 'express';
import recruiterSubscriptionService from '../services/recruiterSubscription.service';
import { successResponse, errorResponse } from '../utils/apiReponose';

const recruiterSubscriptionController = {
  getAllByRecruiter: async (req: Request, res: Response) => {
    try {
      const recruiterId = req.header('X-Header-Id');
      if (!recruiterId) throw new Error('Missing recruiter ID');

      const data = await recruiterSubscriptionService.getAllByRecruiter(
        recruiterId
      );
      res
        .status(200)
        .json(successResponse('Fetched recruiter subscriptions', data));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await recruiterSubscriptionService.getAll();
      res
        .status(200)
        .json(successResponse('All recruiter subscriptions', data));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  getByRecruiterId: async (req: Request, res: Response) => {
    try {
      const { recruiterId } = req.params;
      const data = await recruiterSubscriptionService.getByRecruiterId(
        recruiterId
      );
      res.status(200).json(successResponse('Subscriptions by recruiter', data));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const recruiterId = req.header('X-Header-Id');
      if (!recruiterId) throw new Error('Missing recruiter ID');

      const { subscription_plan_id, price, expired_at, payment_id } = req.body;

      const subscription = await recruiterSubscriptionService.create({
        subscription_plan_id,
        recruiter_profile_id: recruiterId,
        price,
        expired_at,
        payment_id,
      });

      res
        .status(201)
        .json(
          successResponse('Subscription created successfully', subscription)
        );
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  cancel: async (req: Request, res: Response) => {
    try {
      const recruiterId = req.header('X-Header-Id');
      if (!recruiterId) throw new Error('Missing recruiter ID');

      const subscription = await recruiterSubscriptionService.cancel(
        req.params.id,
        recruiterId
      );
      res
        .status(200)
        .json(successResponse('Subscription canceled', subscription));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default recruiterSubscriptionController;
