const actionCommonService = require('./action');
const applicationCommonService = require('./application');
const deploymentCommonService = require('./deployment');
const environmentCommonService = require('./environment');
const globalCommonService = require('./global');
const parameterCommonService = require('./parameter');
const reportCommonService = require('./report');
const scheduleCommonService = require('./schedule');
const tableCommonService = require('./table');
const themeCommonService = require('./theme');

module.exports = {
  action: actionCommonService,
  application: applicationCommonService,
  deployment: deploymentCommonService,
  environment: environmentCommonService,
  global: globalCommonService,
  parameter: parameterCommonService,
  report: reportCommonService,
  schedule: scheduleCommonService,
  table: tableCommonService,
  theme: themeCommonService,
};
