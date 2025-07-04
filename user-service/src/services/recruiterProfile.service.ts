import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const recruiterProfileService = {
  getAll: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.recruiterProfile.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.recruiterProfile.count(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  getById: (id: string) => {
    return prisma.recruiterProfile.findUniqueOrThrow({ where: { id } });
  },

  create: (data: any) => {
    return prisma.recruiterProfile.create({
      data: {
        id: uuidv4(),
        ...data,
      },
    });
  },

  update: (id: string, data: any) => {
    return prisma.recruiterProfile.update({
      where: { id },
      data,
    });
  },

  remove: (id: string) => {
    return prisma.recruiterProfile.delete({ where: { id } });
  },
};

export default recruiterProfileService;
