const config = require('config');

const reportDataService = require('../../dataServices').report;
const logger = require('../../common/logger');
const RequestHelper = require('../../common/requestHelper');

class Report {
  async getReports(paramsObject) {
    logger.debug('Getting reports from the database');

    try {
      const result = await reportDataService.getReports(paramsObject.appId);
      logger.debug('Successfully retreived reports');
      return result;
    } catch (err) {
      logger.error('Error while geting reports', err);
      throw err;
    }
  }

  async createReport(paramsObject, reportObject, userObject) {
    reportObject.createdBy = userObject.username;
    reportObject.updatedBy = new Date();

    logger.debug('Creating a report in the database');

    try {
      const result = await reportDataService.createReport(paramsObject.appId, reportObject);
      logger.debug('Successfully created report');
      return {
        id: result.insertedId,
      };
    } catch (err) {
      logger.error('Error while creating report', err);
      throw err;
    }
  }

  async updateReport(paramsObject, reportObject, userObject) {
    reportObject.updatedBy = userObject.username;
    reportObject.updatedAt = new Date();

    logger.debug('Updating report in the database', paramsObject.reportId);

    try {
      const result = await reportDataService.updateReport(paramsObject.reportId, reportObject);
      logger.debug('Successfully updated report');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while updating report', err);
      throw err;
    }
  }

  async deleteReport(paramsObject) {
    logger.debug('Deleting report in the database', paramsObject.reportId);

    try {
      const result = await reportDataService.deleteReport(paramsObject.reportId);
      logger.debug('Successfully deleted report');
      return {
        ok: result.result.n > 0,
      };
    } catch (err) {
      logger.error('Error while deleting report', err);
      throw err;
    }
  }

  async getLogs(paramsObject, authData) {
    try {
      const requestHelper = new RequestHelper(`${config.jobprocessor.server}${config.jobprocessor.path}`, { Authorization: authData });
      const reportData = await reportDataService.getReportByProperty('_id', paramsObject.reportId);

      const response = await requestHelper.get.url(config.jobprocessor.api.getLogs).params({ name: reportData.url }).makeRequest();
      return response.data;
    } catch (err) {
      logger.error('Error while getting report logs', err);
      throw err;
    }
  }
}

module.exports = new Report();
