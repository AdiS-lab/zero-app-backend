import webpush from 'web-push';
import nodemailer from 'nodemailer';
import config from './config/config';
import { Queue, Worker } from 'bullmq';
import type {
  PushSubscriptionObject,
  PushBody,
} from './types/notifications.ts';

const redisHost = config.appMode == 'DEV' ? 'localhost' : 'redis';
class AppNotifications {
  async sendPush(sub: PushSubscriptionObject, message: PushBody) {
    const payload = JSON.stringify(message);
    webpush.sendNotification(sub, payload, { TTL: 60 });
  }
}
export const appNotifications = new AppNotifications();

export const emailWorker = new Worker(
  'emailQueue',
  async (message) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email,
        pass: config.password,
      },
    });
    transporter.sendMail({ from: config.email, ...message.data });
  },
  {
    connection: { host: redisHost, port: 6379 },
    limiter: { max: 100, duration: 60000 }, // Limit to 100 emails per minute
  }
);

export const emailQueue = new Queue('emailQueue', {
  connection: { host: redisHost, port: 6379 },
});
