import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { deleteFile, uploadFile } from '../utils/storage/supabase.storage';
import { Request } from 'express';
import { StorageType } from '../enums/storageType.enum';

const prisma = new PrismaClient();

const jobSeekerProfileService = {
  getAll: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.jobSeekerProfile.findMany({
        skip,
        take: limit,
      }),
      prisma.jobSeekerProfile.count(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  getById: (id: string) => {
    return prisma.jobSeekerProfile.findUniqueOrThrow({ where: { id } });
  },

  create: (data: any) => {
    return prisma.jobSeekerProfile.create({
      data: {
        id: uuidv4(),
        ...data,
      },
    });
  },

  update: async (userId: string, req: Request) => {
    if (!req.file) throw new Error('Missing resume file');

    const jobSeekerInfor = await prisma.jobSeekerProfile.findUnique({
      where: { account_id: userId },
    });
    if (!jobSeekerInfor) throw new Error('JobSeekerInfor not found');

    if (jobSeekerInfor.resume_url) {
      await deleteFile(jobSeekerInfor.resume_url, StorageType.RESUME);
    }

    const newResumeUrl = await uploadFile(userId, req.file, StorageType.RESUME);

    await prisma.jobSeekerProfile.update({
      where: { account_id: userId },
      data: { resume_url: newResumeUrl },
    });

    return newResumeUrl;
  },

  remove: (id: string) => {
    return prisma.jobSeekerProfile.delete({ where: { id } });
  },
};

export default jobSeekerProfileService;
