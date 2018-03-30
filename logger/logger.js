'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const {createLogger, format, transports} = require('winston');
const {combine, printf} = format;

const appDir = path.resolve(__dirname, '../');
const errorLogFilename = path.join(appDir, 'error.log');
const combinedLogFilename = path.join(appDir, 'combined.log');

const myFormat = printf(info => {
    return `[${info.timestamp}][${info.level}]: ${info.message}`;
});

const appendTimestamp = format((info, opts) => {
    if (opts.tz)
        info.timestamp = moment().tz(opts.tz).format();
    return info;
});

//
// Remove the file, ignoring any errors
//
try {
    fs.unlinkSync(errorLogFilename);
    fs.unlinkSync(combinedLogFilename);
}
catch (ex) {
}

const logger = createLogger({
    format: combine(
        appendTimestamp({ tz: 'Asia/Hongkong' }),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: errorLogFilename, level: 'error'}),
        new transports.File({filename: combinedLogFilename})
    ]
});

module.exports = logger;