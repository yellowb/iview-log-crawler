const _ = require('lodash');

const commonPart = require('./common');
const fullConfig = {};

_.assign(fullConfig, commonPart);

module.exports = fullConfig;