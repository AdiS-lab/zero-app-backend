import app from './app';
import config from './config/config';

import dbConnection from './db/connection';
import logger from './logs/logger';

import { Server } from 'socket.io';
import { createServer } from 'node:http';

logger.debug(JSON.stringify(config));

dbConnection(config.mongoUri)
  .then(() => {
    logger.debug('mongo connected');
    const server = createServer(app);
    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      logger.info('connected', socket.id);

      socket.on('chat-message', (data) => {
        logger.info('message sent was', data);
        io.emit('message-sent', data);
      });
    });

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
  })
  .catch((error) => {
    logger.error('Failed to connect to the database:', error);
  });
