const winston = require("winston");
const path = require("path");
const fs = require("fs");

const LOG_DIR = process.env.LOG_DIR_PATH || "logs";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Enhanced formatter to include metadata objects
const formatWithMetadata = winston.format.printf(info => {
  const { timestamp, level, message, ...rest } = info;
  const restString = Object.keys(rest).length ? " " + JSON.stringify(rest) : "";
  return `${timestamp} [${level.toUpperCase()}]: ${message}${restString}`;
});

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    formatWithMetadata
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(LOG_DIR, "realto-app.log"),
      level: LOG_LEVEL,
    }),
  ],
});

module.exports = logger;



// Log Errors with Stack Trace
// try {
//   throw new Error('Sample crash');
// } catch (err) {
//   logger.error(`Error occurred: ${err.stack}`);
// }
