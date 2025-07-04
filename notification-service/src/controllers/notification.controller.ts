import { Request, Response } from 'express';
import emailService from '../services/email.service'
import { errorResponse, successResponse } from '../utils/apiResponses';

const notificationController = {
  sendEmail: async (req: Request, res: Response) => {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res
        .status(400)
        .json(errorResponse('Missing required fields: to, subject, html'));
    }

    try {
      await emailService.sendMail({ to, subject, html });
      res.json(successResponse('Email sent successfully'));
    } catch (err: any) {
      res.status(500).json(errorResponse(err.message));
    }
  },
};

export default notificationController;
