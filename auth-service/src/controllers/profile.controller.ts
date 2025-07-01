import { Request, Response } from 'express';
import profileService from './../services/profile.service';
import { successResponse, errorResponse } from '../utils/apiResponse';

const profileController = {
  getProfile: async (req: Request, res: Response) => {
    const userId = req.header('X-User-Id');
    try {
      const profile = await profileService.getProfile(userId!);
      res
        .status(200)
        .json(successResponse('Profile fetched successfully', profile));
    } catch (err: any) {
      res.status(404).json(errorResponse(err.message));
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    const userId = req.header('X-User-Id');
    const { first_name, last_name, phone } = req.body;
    try {
      const updated = await profileService.updateProfile(userId!, {
        first_name,
        last_name,
        phone,
      });
      res
        .status(200)
        .json(successResponse('Profile updated successfully', updated));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  updateAvatar: async (req: Request, res: Response) => {
    try {
      const userId = req.header('X-User-Id');
      const avatarUrl = await profileService.updateAvatar(userId!, req);
      res
        .status(200)
        .json(successResponse('Avatar updated successfully', { avatarUrl }));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default profileController;
