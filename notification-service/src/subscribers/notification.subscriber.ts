import { redisSubscriber } from '../core/redis.core';
import { RedisEvent } from '../enums/redisEvent.enum';
import { VerificationPurpose } from '../enums/verificationPurpose.enum';
import emailService from '../services/email.service';
import {
  buildAccountVerificationEmail,
  buildCodeEmail,
} from '../templates/email.templates';

const channel = RedisEvent.EMAIL_NOTIFICATION;

redisSubscriber.subscribe(channel, (err, count) => {
  if (err) {
    return;
  }
});

redisSubscriber.on('message', (chan, message) => {
  if (chan !== channel) return;

  try {
    const data = JSON.parse(message);
    switch (data.purpose) {
      case VerificationPurpose.ACCOUNT_VERIFICATION:
        emailService.sendMail({
          to: data.to,
          subject: 'Account Verification',
          html: buildAccountVerificationEmail(data.content),
        });
        break;
      case VerificationPurpose.PASSWORD_RESET:
        emailService.sendMail({
          to: data.to,
          subject: 'Password Reset Request',
          html: buildCodeEmail('Password Reset', data.content),
        });
        break;
      case VerificationPurpose.CHANGE_PASSWORD:
        emailService.sendMail({
          to: data.to,
          subject: 'Change Password Request',
          html: buildCodeEmail('Change Password', data.content),
        });
        break;
    }
  } catch (error) {}
});
