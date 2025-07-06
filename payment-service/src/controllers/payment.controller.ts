import { Request, Response } from 'express';
import paymentService from '../services/payment.service';
import { successResponse, errorResponse } from '../utils/apiReponose';

const paymentController = {
  getPaymentDetail: async (req: Request, res: Response) => {
    try {
      const { paymentId } = req.params;
      const payment = await paymentService.getPaymentDetail(paymentId);
      res.status(200).json(successResponse('Payment detail fetched', payment));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  getAllPayments: async (req: Request, res: Response) => {
    try {
      const {
        status,
        page,
        limit,
        userId,
        trasactionType,
        paymentMethod,
        startDate,
        endDate,
      } = req.query;

      const payments = await paymentService.getAllPayments({
        userId: userId as string,
        status: status as string,
        transactionType: trasactionType as string,
        paymentMethod: paymentMethod as string,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json(successResponse('Payments fetched', payments));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default paymentController;
