import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { logEmailError } from '../utils/logger';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const emailService = {
  sendMail: async ({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) => {
    try {
      await transporter.sendMail({
        from: `"Notification Service" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
    } catch (error: any) {
      logEmailError(to, error.message);
      throw new Error('Failed to send email');
    }
  },
};

export default emailService;
