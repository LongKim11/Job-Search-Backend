import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { deleteFile, uploadFile } from '../utils/storage/supabase.storage';

const prisma = new PrismaClient();

const profileService = {
  getProfile: async (userId: string) => {
    const user = await prisma.account.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        avatar_url: true,
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  },

  updateProfile: async (
    userId: string,
    data: { first_name?: string; last_name?: string; phone?: string }
  ) => {
    const updated = await prisma.account.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
      },
    });
    return updated;
  },

  updateAvatar: async (userId: string, req: Request) => {
    if (!req.file) throw new Error('Missing avatar file');

    const account = await prisma.account.findUnique({ where: { id: userId } });
    if (!account) throw new Error('Account not found');

    if (account.avatar_url) {
      await deleteFile(account.avatar_url);
    }

    const newAvatarUrl = await uploadFile(userId, req.file);

    await prisma.account.update({
      where: { id: userId },
      data: { avatar_url: newAvatarUrl },
    });

    return newAvatarUrl;
  },
};

export default profileService;
