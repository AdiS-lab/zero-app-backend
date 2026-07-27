import app from './app';
import config from './config/config';

import dbConnection from './db/connection';
import logger from './logs/logger';

import {Server} from 'socket.io'
import { createServer } from 'node:http';

dbConnection(config.mongoUri)
  .then(() => {
    const server = createServer(app);
    const io = new Server(server, 
      {
        cors: {
          origin: "http://localhost:5173",                                                                  
          credentials: true,                                                                              
        }
      }
    )

    io.on('connection', (socket) => {
        logger.info(`user connected`);

        socket.on('disconnect', () => {
          console.log('user disconnected');
        });

        socket.on('online', () => {
            logger.info('A new user has joined the chat');
            io.sockets.emit('joined',{
                'success':true,
            });
        });

        socket.on('chat message', (msg) => {
            console.log('message: ', msg);
            io.sockets.emit('chat', msg);
        });
    });

    server.listen(config.port, function() {
      console.log('Server is running on port:', config.port)
    })

    

    server.on('SIGINT', () => {
      console.log('Received SIGINT. Shutting down server...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to the database:', error);
  });

  