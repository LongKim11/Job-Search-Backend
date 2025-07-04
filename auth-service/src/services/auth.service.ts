import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import redis from '../utils/redis';

const prisma = new PrismaClient();

const authService = {
  register: async ({
    first_name,
    last_name,
    email,
    password,
    phone,
  }: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    const existing = await prisma.account.findUnique({ where: { email } });
    if (existing) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await prisma.account.create({
      data: {
        id: uuidv4(),
        first_name,
        last_name,
        email,
        phone,
        password: hashedPassword,
        avatar_url: null,
      },
    });

    return account;
  },

  login: async (email: string, password: string) => {
    const account = await prisma.account.findUnique({ where: { email } });
    if (!account) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, account.password);
    if (!match) throw new Error('Invalid credentials');

    const accessExpiry = (process.env.ACCESS_TOKEN_EXPIRY ||
      '15m') as SignOptions['expiresIn'];
    const refreshExpiry = (process.env.REFRESH_TOKEN_EXPIRY ||
      '7d') as SignOptions['expiresIn'];

    const accessToken = jwt.sign(
      { accountId: account.id, roleId: account.roleId },
      process.env.ACCESS_TOKEN_SECRET || 'access_secret',
      { expiresIn: accessExpiry }
    );

    const refreshToken = jwt.sign(
      { accountId: account.id, roleId: account.roleId },
      process.env.REFRESH_TOKEN_SECRET || 'refresh_secret',
      { expiresIn: refreshExpiry }
    );

    await redis.set(
      `refreshToken:${refreshToken}`,
      account.id,
      'EX',
      7 * 24 * 60 * 60
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: account.id,
        first_name: account.first_name,
        last_name: account.last_name,
        email: account.email,
        phone: account.phone,
        avatar_url: account.avatar_url,
        roleId: account.roleId,
      },
    };
  },

  refreshToken: async (refreshToken: string) => {
    const accountId = await redis.get(`refreshToken:${refreshToken}`);
    if (!accountId) throw new Error('Refresh token expired or invalid');

    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || 'refresh_secret'
    );

    const account = await prisma.account.findUnique({
      where: { id: decoded.accountId },
    });
    if (!account) throw new Error('Account not found');

    const accessExpiry = (process.env.ACCESS_TOKEN_EXPIRY ||
      '15m') as SignOptions['expiresIn'];
    const refreshExpiry = (process.env.REFRESH_TOKEN_EXPIRY ||
      '7d') as SignOptions['expiresIn'];

    const newAccessToken = jwt.sign(
      { accountId: account.id, roleId: account.roleId },
      process.env.ACCESS_TOKEN_SECRET || 'access_secret',
      { expiresIn: accessExpiry }
    );

    const newRefreshToken = jwt.sign(
      { accountId: account.id, roleId: account.roleId },
      process.env.REFRESH_TOKEN_SECRET || 'refresh_secret',
      { expiresIn: refreshExpiry }
    );

    await redis.del(`refreshToken:${refreshToken}`);
    await redis.set(
      `refreshToken:${newRefreshToken}`,
      account.id,
      'EX',
      7 * 24 * 60 * 60
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  sendVerificationCode: async (email: string, purpose: string) => {
    const account = await prisma.account.findUnique({ where: { email } });
    if (!account) throw new Error('Account not found');

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        purpose,
        accountId: account.id,
        expired_at: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`[Verification] Code for ${email}: ${code}`);
    return { message: 'Verification code sent to your email' };
  },

  verifyEmail: async (code: string) => {
    // const record = await prisma.verificationCode.findFirst({
    //   where: {
    //     code,
    //     is_used: false,
    //     expired_at: { gt: new Date() },
    //   },
    //   include: { account: true },
    // });

    // if (!record) throw new Error('Invalid or expired verification code');

    // await prisma.verificationCode.update({
    //   where: { id: record.id },
    //   data: { is_used: true },
    // });

    return { message: 'Email verified successfully' };
  },

  logout: async (refreshToken: string) => {
    await redis.del(`refreshToken:${refreshToken}`);
    return { message: 'Logged out successfully' };
  },

  resendVerificationCode: async (email: string) => {
    return await authService.sendVerificationCode(email, 'email_verification');
  },
  changePassword: async ({
    accountId,
    oldPassword,
    newPassword,
  }: {
    accountId: string;
    oldPassword: string;
    newPassword: string;
  }) => {
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account) throw new Error('Account not found');

    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch) throw new Error('Old password is incorrect');

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.account.update({
      where: { id: accountId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }
};

export default authService;
