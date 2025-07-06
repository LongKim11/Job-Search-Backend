import { Router } from 'express';
import vnpayController from '../controllers/vnpay.controller';
import paymentController from '../controllers/payment.controller';

const router = Router();
router.get('/detail/:paymentId', paymentController.getPaymentDetail);
router.get('/all', paymentController.getAllPayments);
router.post('/create-qr', vnpayController.createPaymentQR);
router.get('/check-payment-vnpay', vnpayController.checkPayment);

export default router;
