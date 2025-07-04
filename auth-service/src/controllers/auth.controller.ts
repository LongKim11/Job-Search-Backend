import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/apiResponse';
import authService from './../services/auth.service';

const authController = {
  register: async (req: Request, res: Response) => {
    const { first_name, last_name, email, password, phone } = req.body;
    try {
      const account = await authService.register({
        first_name,
        last_name,
        email,
        password,
        phone,
      });
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
    const { code } = req.body;
    const userId = req.header('X-User-Id');
    const userRole = req.header('X-User-Role');
    try {
      await authService.verifyEmail(code);
      res.status(200).json(successResponse('Email verified successfully'));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  resendVerificationCode: async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      await authService.resendVerificationCode(email);
      res
        .status(200)
        .json(successResponse('Verification code resent successfully'));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
  changePassword: async (req: Request, res: Response) => {
    try {
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
};

export default authController;
