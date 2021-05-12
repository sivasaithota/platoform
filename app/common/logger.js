const logConfig = require('config').get('logging');
const enframeJsCommon = require('@opexanalytics-rad/enframe-js-common');

const config = {
  ...logConfig,
};

module.exports = new enframeJsCommon.Logger(config);
