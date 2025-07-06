import { PaymentStatus } from '../enums/paymentStatus.enum';
import { redisSubscriber } from '../core/redis.core';
import { PrismaClient } from '@prisma/client';
import { logPaymetExpired } from '../utils/logger';

const prisma = new PrismaClient();

export const initRedisSubscriber = () => {
  redisSubscriber.psubscribe('__keyevent@0__:expired', (err, count) => {
    if (err) console.error('Failed to subscribe expired event', err);
    else console.log(`Subscribed to expired keys: ${count} channel(s)`);
  });

  redisSubscriber.on('pmessage', async (pattern, channel, expiredKey) => {
    if (expiredKey.startsWith('payment:')) {
      const txnRef = expiredKey.split(':')[1];
      const payment = await prisma.paymentHistory.findUnique({
        where: { id: txnRef },
      });

      if (payment && payment.status === PaymentStatus.PENDING) {
        logPaymetExpired('payment-service', `Payment expired: ${expiredKey}`);
        await prisma.paymentHistory.update({
          where: { id: txnRef },
          data: { status: PaymentStatus.EXPIRED },
        });
      }
    }
  });
};
