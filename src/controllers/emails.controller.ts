import Email from '../models/email.model';
import BaseController from './base.controller';

class EmailsController extends BaseController {
  constructor() {
    super(Email);
  }

  listeners() {
    this.broker.on('auth:signup', async (payload) => {
      const { email, subject, text, _id } = payload;
      const accessToken = await this.jwt.createAccessToken({ _id, email });
      const html = `
        <div>
          <p>Click the link below</p>
          <a href="http://localhost:8000/api/v1/auth/verify-email/${accessToken}">Verify Email</a>
        </div>
      `;

      const queue = this.registry.get('email.queue');
      queue.add(
        'sendEmail',
        { to: email, subject, text, html },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        }
      );
    });

    this.broker.on('auth:password-reset', async (payload) => {
      const { email, subject, text, _id } = payload;
      const accessToken = await this.jwt.createAccessToken({ _id, email });
      const html = `
        <div>
          <p>Click the link below to reset password</p>
          <a href='http://localhost:5173/forgot-password/change-password/${accessToken}'>Reset Password</a>
        </div>
      `;

      const queue = this.registry.get('email.queue');
      queue.add(
        'sendEmail',
        { to: email, subject, text, html },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        }
      );
    });
  }
}

export default new EmailsController();
