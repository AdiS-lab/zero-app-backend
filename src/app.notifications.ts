import webpush from 'web-push';
import nodemailer from 'nodemailer';
import config from './config/config';
import type {
  PushSubscriptionObject,
  EmailBody,
  PushBody,
} from './types/notifications.ts';

class AppNotifications {
  async sendPush(sub: PushSubscriptionObject, message: PushBody) {
    const payload = JSON.stringify(message);
    webpush.sendNotification(sub, payload, { TTL: 60 });
  }

  async sendEmail(message: EmailBody) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email,
        pass: config.password,
      },
    });

    transporter.sendMail({ from: config.email, ...message });
  }
}

const appNotifications = new AppNotifications();

export default appNotifications;
