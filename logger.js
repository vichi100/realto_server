const winston = require('winston');
require('winston-daily-rotate-file');
const { LOG_DIR_PATH, LOG_LEVEL} = require('./config/env');

// Absolute path for external logs
const logDirectory =LOG_DIR_PATH;//'/var/log/realto-api';

const transport = new winston.transports.DailyRotateFile({
  filename: `${logDirectory}/app-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    transport,
    new winston.transports.Console(),
  ],
});

module.exports = logger;


// Log Errors with Stack Trace
// try {
//   throw new Error('Sample crash');
// } catch (err) {
//   logger.error(`Error occurred: ${err.stack}`);
// }
