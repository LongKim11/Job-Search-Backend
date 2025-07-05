import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/apiResponse';
import authService from './../services/auth.service';
import { VerificationPurpose } from '../enums/verificationPurpose.enum';

const authController = {
  register: async (req: Request, res: Response) => {
    const { first_name, last_name, email, password, phone, role_id } = req.body;
    try {
      const account = await authService.register(
        first_name,
        last_name,
        email,
        password,
        phone,
        role_id
      );
      res.status(201).json(successResponse('Register successful', account));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const tokens = await authService.login(email, password);
      res.status(200).json(successResponse('Login successful', tokens));
    } catch (err: any) {
      res.status(401).json(errorResponse(err.message));
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    try {
      const tokens = await authService.refreshToken(refreshToken);
      res
        .status(200)
        .json(successResponse('Token refreshed successfully', tokens));
    } catch (err: any) {
      res.status(403).json(errorResponse(err.message));
    }
  },

  logout: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    try {
      await authService.logout(refreshToken);
      res.status(200).json(successResponse('Logout successful'));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  verifyEmail: async (req: Request, res: Response) => {
    const { code, purpose } = req.query;
    if (!code || typeof code !== 'string') {
      res.status(400).json(errorResponse('Missing verification code'));
      return;
    }
    if (!purpose || typeof purpose !== 'string') {
      res.status(400).json(errorResponse('Missing verification purpose'));
      return;
    }
    try {
      await authService.verifyEmail(code, purpose);
      if (purpose === VerificationPurpose.ACCOUNT_VERIFICATION) {
        res.redirect(302, process.env.LOGIN_URL || '');
      } else {
        res.status(200).json(successResponse('Email verified successfully'));
      }
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  sendVerificationCode: async (req: Request, res: Response) => {
    const { email, purpose } = req.body;
    try {
      const { data } = await authService.sendVerificationCode(email, purpose);
      res
        .status(200)
        .json(successResponse('Verification code sent successfully', data));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  changePassword: async (req: Request, res: Response) => {
    try {
      // Account ID should be passed in JWT instead of body for security
      const accountId = req.body.accountId;
      const { oldPassword, newPassword } = req.body;

      const result = await authService.changePassword({
        accountId,
        oldPassword,
        newPassword,
      });

      res.status(200).json(successResponse('Password changed', result));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    try {
      const result = await authService.resetPassword(email, newPassword);
      res.status(200).json(successResponse('Password reset', result));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default authController;
