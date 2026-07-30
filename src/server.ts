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
      logger.info(`user connected`);

      socket.on('disconnect', () => {
        logger.info('user disconnected');
      });

      socket.on('online', () => {
        logger.info('A new user has joined the chat');
        io.sockets.emit('joined', {
          success: true,
        });
      });

      socket.on('chat message', (msg) => {
        logger.info('message: ', msg);
        io.sockets.emit('chat', msg);
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
