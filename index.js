const logger = require('./logger').logger;
const constants = require('./constants');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

logger.info('NODE_ENV: ' + process.env.NODE_ENV);
logger.info('App[' + constants.appName + '] starting...');