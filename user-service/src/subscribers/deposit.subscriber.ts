import { redisSubscriber } from '../core/redis.core';
import { RedisEvent } from '../enums/redisEvent.enum';
import recruiterProfileService from '../services/recruiterProfile.service';

const channel = RedisEvent.DEPOSIT;

redisSubscriber.subscribe(channel, (err, count) => {
  if (err) {
    return;
  }
});

redisSubscriber.on('message', async (chan, message) => {
  if (chan !== channel) return;

  try {
    const data = JSON.parse(message);
    await recruiterProfileService.updateAccountBalance(
      data.to,
      data.content,
      data.purpose
    );
  } catch (error) {
    console.error('Error handling message:', error);
  }
});
