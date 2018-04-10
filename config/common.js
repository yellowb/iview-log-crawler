const path = require('path');
const downloadedFileDir = path.resolve(__dirname, "../") + '\\downloads';

const config = {
    logFileDir: 'logs',
    downloadedFileDir: downloadedFileDir
};

module.exports = config;





