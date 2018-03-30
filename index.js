const logger = require('./logger').logger;

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

logger.info('NODE_ENV: ' + process.env.NODE_ENV);