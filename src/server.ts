import app from './app';
import config from './config/config';

import dbConnection from './db/connection';
import logger from './logs/logger';

import { Server } from 'socket.io';
import { createServer } from 'node:http';
import initializeSocket from './utils/socket-handler';

logger.debug(JSON.stringify(config));

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

initializeSocket(io);

server.listen(config.port, function () {
  logger.info('Server is running on port: ', config.port, 'hello world');
});

server.on('SIGINT', () => {
  logger.info('Received SIGINT. Shutting down server...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

logger.info('test');

dbConnection(config.mongoUri)
  .then(() => {
    logger.debug('mongo connected');
  })
  .catch((error) => {
    logger.error('Failed to connect to the database:', error);
  });
