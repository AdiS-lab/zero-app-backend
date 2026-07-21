import app from './app';
import config from './config/config';

import dbConnection from './db/connection';
import logger from './logs/logger';

dbConnection(config.mongoUri)
  .then(() => {
    const server = app.listen(config.port, function () {
      console.log('Server is running on port:', config.port);
    });

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
