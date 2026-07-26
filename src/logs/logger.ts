import winston from 'winston'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const logger = winston.createLogger({
  level: process.env.APP_MODE === 'production' ? 'warn' : 'debug', 
  levels,
  transports: [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf((info) => `[${info.level}]: ${info.message}`),
    ),
    handleExceptions: true,
    handleRejections: true,
    }),
  ],
  exitOnError: false
});

export default logger;
