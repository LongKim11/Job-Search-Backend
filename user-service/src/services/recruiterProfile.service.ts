import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { deleteFile, uploadFile } from '../utils/storage/supabase.storage';
import { StorageType } from '../enums/storageType.enum';
import { DepositType } from '../enums/depositType.enum';

const prisma = new PrismaClient();

const recruiterProfileService = {
  getAll: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.recruiterProfile.findMany({
        skip,
        take: limit,
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

  updateBussinessLicense: async (userId: string, req: Request) => {
    if (!req.file) throw new Error('Missing business license file');

    const recruiterInfor = await prisma.recruiterProfile.findUnique({
      where: { account_id: userId },
    });
    if (!recruiterInfor) throw new Error('RecruiterInfor not found');

    if (recruiterInfor.business_license_url) {
      await deleteFile(
        recruiterInfor.business_license_url,
        StorageType.BUSINESS_LICENSE
      );
    }

    const newBusinessLicenseUrl = await uploadFile(
      userId,
      req.file,
      StorageType.BUSINESS_LICENSE
    );

    await prisma.recruiterProfile.update({
      where: { account_id: userId },
      data: { business_license_url: newBusinessLicenseUrl },
    });

    return newBusinessLicenseUrl;
  },

  updateAccountBalance: async (
    userId: string,
    amount: number,
    type: string
  ) => {
    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { account_id: userId },
    });
    if (!recruiterProfile) throw new Error('Recruiter profile not found');
    const newBalance =
      DepositType.CREDIT === type
        ? Number(recruiterProfile.account_balance || 0) + Number(amount)
        : (Number(recruiterProfile.account_balance) || 0) - Number(amount);

    return prisma.recruiterProfile.update({
      where: { account_id: userId },
      data: { account_balance: Number(newBalance) },
    });
  },

  remove: (id: string) => {
    return prisma.recruiterProfile.delete({ where: { id } });
  },
};

export default recruiterProfileService;
