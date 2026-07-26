import express from 'express';

import router from './app.router';

import logger from './logs/logger';

import morgan from 'morgan';

const app = express();

app.use(morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      timestamp: tokens.date?.(req, res, "iso") ?? null,
      method: tokens.method?.(req, res) ?? null,
      url: tokens.url?.(req, res) ?? null,
      status: Number(tokens.status?.(req, res)) || 0,
      responseTimeMs: Number(tokens["response-time"]?.(req, res)) || 0,
    });
  }
));

// middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(router);

app.get('/ping', function (req, res) {
  res.send('pong');
});

logger.info("testing winston")

export default app;
