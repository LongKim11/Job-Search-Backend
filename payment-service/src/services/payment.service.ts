import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const paymentService = {
  getPaymentDetail: async (paymentId: string) => {
    if (!paymentId) throw new Error('Payment ID is required');

    const payment = await prisma.paymentHistory.findUnique({
      where: { id: paymentId },
    });

    if (!payment) throw new Error('Payment not found');

    return payment;
  },

  getAllPayments: async (params: {
    userId?: string;
    status?: string;
    transactionType?: string;
    paymentMethod?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const {
      userId,
      status,
      page = 1,
      limit = 10,
      transactionType,
      paymentMethod,
      startDate,
      endDate,
    } = params;

    const where: any = {};
    if (userId) where.account_id = userId;
    if (status) where.status = status;
    if (transactionType) where.transaction_type = transactionType;
    if (paymentMethod) where.method = paymentMethod;
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at.gte = new Date(startDate);
      if (endDate) where.created_at.lte = new Date(endDate);
    }
    const [data, total] = await Promise.all([
      prisma.paymentHistory.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.paymentHistory.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      data,
    };
  },
};

export default paymentService;
