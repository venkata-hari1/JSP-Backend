import winston from 'winston';

const transports: winston.transport[] = [
  new winston.transports.Console(), // only console log on Vercel
];

// Optional: only add file transport in local/dev
if (process.env.NODE_ENV !== 'production') {
  const fs = require('fs');
  const logDir = 'logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports,
});

export default logger;
