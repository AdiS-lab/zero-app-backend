import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import router from './app.router';
import registry from './app.registry';
import logger from './logs/logger';
import config from './config/config';
import webpush from 'web-push';
import EmailsController from './controllers/emails.controller';
import { emailWorker, emailQueue } from './app.notifications';
import cookieParser from 'cookie-parser';

import { User, Auth } from './models';

const app = express();

// middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// routes
app.use(router);

app.use(cookieParser());

app.use(
  morgan(
    (tokens, req, res) => {
      return JSON.stringify({
        timestamp: tokens.date?.(req, res, 'iso') ?? null,
        method: tokens.method?.(req, res) ?? null,
        url: tokens.url?.(req, res) ?? null,
        status: Number(tokens.status?.(req, res)) || 0,
        responseTimeMs: Number(tokens['response-time']?.(req, res)) || 0,
      });
    },
    {
      stream: {
        write: (message) => {
          logger.http(message.trim());
        },
      },
    }
  )
);

logger.info('morgan initialized');

registry.register('user.model', User);
registry.register('auth.model', Auth);
registry.register('emails.controller', EmailsController);
registry.register('email.worker', emailWorker);
registry.register('email.queue', emailQueue);

webpush.setVapidDetails(
  'mailto: test@test.com',
  config.vapidPublicKey,
  config.vapidSecretKey
);

logger.info('webpush and registry initialized');

app.get('/ping', function (req, res) {
  res.send('pong');
});

export default app;
