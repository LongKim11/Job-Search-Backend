import { Request, Response } from 'express';
import subscriptionPlanService from '../services/subscriptionPlan.service';
import { successResponse, errorResponse } from '../utils/apiReponose';

const subscriptionPlanController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { isActive, page, limit, noPage } = req.query;
      const result = await subscriptionPlanService.getAll({
        isActive:
          isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        noPage: noPage === 'true',
      });
      res
        .status(200)
        .json(
          successResponse('Subscription plans fetched successfully', result)
        );
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const plan = await subscriptionPlanService.create(req.body);
      res
        .status(201)
        .json(successResponse('Subscription plan created successfully', plan));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updated = await subscriptionPlanService.update(
        req.params.id,
        req.body
      );
      res
        .status(200)
        .json(
          successResponse('Subscription plan updated successfully', updated)
        );
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  toggleActive: async (req: Request, res: Response) => {
    try {
      const updated = await subscriptionPlanService.toggleActive(req.params.id);
      res
        .status(200)
        .json(successResponse('Subscription plan status toggled', updated));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default subscriptionPlanController;
