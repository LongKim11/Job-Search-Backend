import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { logEmailError } from '../utils/logger';
import { log } from 'console';

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
      const info = await transporter.sendMail({
        from: `"Notification Service" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      // console.log(`[Email] ✅ Sent to: ${to}, Message ID: ${info.messageId}`);
      logEmailError(to, `Email sent successfully, Message ID: ${info.messageId}`);
    } catch (error: any) {
      // console.error(`[Email] ❌ Failed to send to ${to}: ${error.message}`);
      logEmailError(to, error.message);
      throw new Error('Failed to send email');
    }
  },
};

export default emailService;
