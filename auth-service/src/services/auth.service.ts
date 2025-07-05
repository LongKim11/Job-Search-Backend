import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { VerificationPurpose } from '../enums/verificationPurpose.enum';
import { redisClient, redisPublisher } from '../core/redis.core';
import { RedisEvent } from '../enums/redisEvent.enum';

const prisma = new PrismaClient();

const authService = {
  register: async (
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    phone: string,
    role_id: string
  ) => {
    const existing = await prisma.account.findUnique({ where: { email } });
    if (existing) throw new Error('Email already registered');
    const role = await prisma.role.findUnique({ where: { id: role_id } });
    if (!role) throw new Error(`Role '${role_id}' does not exist`);

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
        roleId: role.id,
      },
    });

    const code = uuidv4();
    const expired_at = new Date(Date.now() + 180 * 1000);
    await prisma.verificationCode.create({
      data: {
        id: uuidv4(),
        code,
        purpose: VerificationPurpose.ACCOUNT_VERIFICATION,
        expired_at,
        accountId: account.id,
      },
    });

    const verificationUrl = `${process.env.APP_URL}/verify?code=${code}&purpose=${VerificationPurpose.ACCOUNT_VERIFICATION}`;
    await redisPublisher.publish(
      RedisEvent.EMAIL_NOTIFICATION,
      JSON.stringify({
        to: account.email,
        content: verificationUrl,
        purpose: VerificationPurpose.ACCOUNT_VERIFICATION,
      })
    );

    return {
      account: {
        id: account.id,
        first_name: account.first_name,
        last_name: account.last_name,
        email: account.email,
        phone: account.phone,
        avatar_url: account.avatar_url,
        role: role.role_name,
        isActive: account.is_active,
      },
      verificationUrl,
    };
  },

  login: async (email: string, password: string) => {
    const account = await prisma.account.findUnique({
      where: { email },
      include: { role: true },
    });
    if (!account) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, account.password);
    if (!match) throw new Error('Password is incorrect');

    // Check with frontend if account is active and verified
    // if (!account.is_active) throw new Error('Account is inactive');
    // if (!account.isVerified) throw new Error('Account is not verified');

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

    await redisClient.set(
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
        role: account.role?.role_name || null,
        isVerified: account.isVerified,
        isActive: account.is_active,
      },
    };
  },

  refreshToken: async (refreshToken: string) => {
    const accountId = await redisClient.get(`refreshToken:${refreshToken}`);
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

    await redisClient.del(`refreshToken:${refreshToken}`);
    await redisClient.set(
      `refreshToken:${newRefreshToken}`,
      account.id,
      'EX',
      7 * 24 * 60 * 60
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  sendVerificationCode: async (email: string, purpose: string) => {
    if (!purpose) throw new Error('Verification purpose is required');
    if (!email) throw new Error('Email is required');
    const account = await prisma.account.findUnique({
      where: { email },
    });
    if (!account) throw new Error('Account not found');

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresInMinutes = parseInt(
      process.env.VERIFICATION_CODE_EXPIRES_IN_MINUTES || '5',
      10
    );
    await prisma.verificationCode.create({
      data: {
        code,
        purpose,
        accountId: account.id,
        expired_at: new Date(Date.now() + expiresInMinutes * 60 * 1000),
      },
    });

    await redisPublisher.publish(
      RedisEvent.EMAIL_NOTIFICATION,
      JSON.stringify({
        to: account.email,
        content: code,
        purpose: purpose,
      })
    );
    return { data: code, message: 'Verification code sent to your email' };
  },

  verifyEmail: async (code: string, purpose: string) => {
    const record = await prisma.verificationCode.findFirst({
      where: {
        code,
        is_used: false,
        purpose,
        expired_at: { gt: new Date() },
      },
      include: { account: true },
    });

    if (!record) throw new Error('Invalid or expired verification code');

    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { is_used: true },
    });

    if (record.purpose === VerificationPurpose.ACCOUNT_VERIFICATION) {
      await prisma.account.update({
        where: { id: record.accountId },
        data: { isVerified: true },
      });
    }

    return { message: 'Email verified successfully' };
  },

  logout: async (refreshToken: string) => {
    await redisClient.del(`refreshToken:${refreshToken}`);
    return { message: 'Logged out successfully' };
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
    const account = await prisma.account.findUnique({
      where: { id: accountId, is_active: true },
    });
    if (!account) throw new Error('Account not found');

    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch) throw new Error('Old password is incorrect');

    if (oldPassword === newPassword) {
      throw new Error('New password must be different from old password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.account.update({
      where: { id: accountId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  },

  resetPassword: async (email: string, newPassword: string) => {
    const account = await prisma.account.findUnique({
      where: { email, is_active: true },
    });
    if (!account) throw new Error('Account not found');

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password reset successfully' };
  },
};

export default authService;
