import { VNPay, HashAlgorithm, ProductCode } from 'vnpay';
import dateFormat from 'dateformat';
import { PrismaClient } from '@prisma/client';
import { PaymentStatus } from '../enums/paymentStatus.enum';
import { PaymentMethod } from '../enums/paymentMethod.enum';
import { redisClient, redisPublisher } from '../core/redis.core';
import { TransactionType } from '../enums/transactionType.enum';
import { RedisEvent } from '../enums/redisEvent.enum';
import { DepositType } from '../enums/depositType.enum';

const fifteenMinutesLater = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes later from now but not yet 7+
const prisma = new PrismaClient();

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE!,
  secureSecret: process.env.VNPAY_SECRET!,
  vnpayHost: process.env.VNPAY_HOST!,
  hashAlgorithm: HashAlgorithm.SHA512,
  loggerFn: (..._args: unknown[]): void => {},
});

const vnpayService = {
  createPaymentQR: async (data: { amount: number }, userId: string) => {
    const { amount } = data;
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID provided');
    }
    if (!amount || typeof amount !== 'number') {
      throw new Error('Invalid amount provided');
    }

    const paymentHistory = await prisma.paymentHistory.create({
      data: {
        account_id: userId,
        amount: amount.toString(),
        status: PaymentStatus.PENDING,
        created_at: new Date(),
        method: PaymentMethod.VNPAY,
        transaction_type: TransactionType.DEPOSIT,
      },
    });

    if (!paymentHistory) {
      throw new Error('Failed to create payment history');
    }
    await redisClient.set(`payment:${paymentHistory.id}`, 'pending', 'EX', 60);

    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: '127.0.0.1', // Replace with actual client IP address in production
      vnp_TxnRef: paymentHistory.id.toString(),
      vnp_OrderInfo: `Payment for order ${paymentHistory.id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.VNPAY_RETURN_URL!,
      vnp_CreateDate: parseInt(dateFormat(new Date(), 'yyyymmddHHMMss')), // Not yet 7+
      vnp_ExpireDate: parseInt(
        dateFormat(fifteenMinutesLater, 'yyyymmddHHMMss')
      ),
    });

    return vnpayResponse;
  },

  checkPayment: async (query: any) => {
    const txnRef = query.vnp_TxnRef;
    const vnp_TransactionStatus = query.vnp_TransactionStatus;

    if (!txnRef || !vnp_TransactionStatus) {
      throw new Error('Missing required query parameters');
    }
    const paymentHistory = await prisma.paymentHistory.findUnique({
      where: { id: txnRef },
    });
    if (!paymentHistory) {
      throw new Error('Payment history not found');
    }
    if (vnp_TransactionStatus === '00') {
      const paymetHistory = await prisma.paymentHistory.update({
        where: { id: txnRef },
        data: {
          status: PaymentStatus.SUCCESS,
        },
      });
      if (!paymetHistory) {
        throw new Error('Failed to update payment history');
      }
      await redisPublisher.publish(
        RedisEvent.DEPOSIT,
        JSON.stringify({
          to: paymentHistory.account_id,
          content: paymentHistory.amount,
          purpose: DepositType.CREDIT,
        })
      );
      return { status: PaymentStatus.SUCCESS, message: 'Payment successful' };
    } else {
      await prisma.paymentHistory.update({
        where: { id: txnRef },
        data: {
          status: PaymentStatus.FAILED,
        },
      });
      return { status: PaymentStatus.FAILED, message: 'Payment failed' };
    }
  },
};

export default vnpayService;
