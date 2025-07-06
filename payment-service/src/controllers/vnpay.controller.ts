import { Request, Response } from 'express';
import vnpayService from '../services/vnpay.service';
import { successResponse, errorResponse } from '../utils/apiReponose';
import { PaymentStatus } from '../enums/paymentStatus.enum';

const vnpayController = {
  createPaymentQR: async (req: Request, res: Response) => {
    try {
      const userId = req.header('X-User-Id');
      const qrData = await vnpayService.createPaymentQR(req.body, userId!);
      res.status(201).json(successResponse('Payment QR created', qrData));
    } catch (err: any) {
      res.status(500).json(errorResponse(err.message));
    }
  },

  checkPayment: async (req: Request, res: Response) => {
    try {
      const result = await vnpayService.checkPayment(req.query);
      if (result.status === PaymentStatus.SUCCESS) {
        res.redirect(302, process.env.PAYMENT_SUCCESS_REDIRECT_URL!);
      } else {
        res.redirect(302, process.env.PAYMENT_FAILED_REDIRECT_URL!);
      }
    } catch (err: any) {
      console.error('Error in checkPayment:', err);
      res.status(400).json({
        status: 'error',
        message: err.message || 'Payment check failed',
      });
    }
  },
};

export default vnpayController;
