import { redisSubscriber } from '../core/redis.core';
import { RedisEvent } from '../enums/redisEvent.enum';

const channel = RedisEvent.JOB_POST;

redisSubscriber.subscribe(channel, (err, count) => {
  if (err) {
    return;
  }
});

redisSubscriber.on('message', async (chan, message) => {
  if (chan !== channel) return;

  try {
    const data = JSON.parse(message);
    console.log('Received job post data:', data);
  } catch (error) {
    console.error('Error handling message:', error);
  }
});
