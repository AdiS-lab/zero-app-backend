import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = winston.createLogger({
  level: process.env.APP_MODE === 'production' ? 'warn' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.json() // Use JSON format for structured logger
  ),
  levels,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => `[${info.level}]: ${info.message}`),
        winston.format.simple()
      ),
      handleExceptions: true,
      handleRejections: true,
    }),

    new winston.transports.File({
      filename: 'src/logs/error.log',
      level: 'error',
    }),

    new winston.transports.File({
      filename: 'src/logs/combined.log',
    }),

    new winston.transports.File({
      filename: 'src/logs/http.log',
      format: winston.format.combine(
        winston.format((info) => (info?.level === 'http' ? info : false))(),
        winston.format.json()
      ),
    }),
  ],
  exitOnError: false,
});

export default logger;
