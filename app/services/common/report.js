const reportDataService = require('../../dataServices').report;
const logger = require('../../common/logger');
const helper = require('../../common/helper');
const constants = require('../../common/constants');

class Report {
  getReportIdByAppId(appId) {
    logger.debug('Fetching report for app', appId);
    return reportDataService.getReportIdByAppId(appId);
  }

  getReportById(reportId) {
    logger.debug('Fetching report by Id', reportId);
    return reportDataService.getReportByProperty('_id', reportId);
  }

  async saveReportByType(reportObject, username) {
    logger.debug(`Saving ${reportObject.type} report for app`, reportObject.appId);
    const existingReport = await reportDataService.getReportByProperty('appId', reportObject.appId);
    const shinyExists = !!existingReport && existingReport.type === constants.types.report.shiny;
    const reportData = { ...reportObject, ...helper.getAuditProperties(username, shinyExists) };
    if (existingReport) {
      reportDataService.updateReport(existingReport._id, reportData);
    } else {
      reportDataService.createReport(reportObject.appId, reportData);
    }
  }
}

module.exports = new Report();
