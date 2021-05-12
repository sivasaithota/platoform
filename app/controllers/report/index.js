const ControllerHelper = require('../../common/controllerHelper');
const reportService = require('../../services/report');
const constants = require('../../common/constants');
const logger = require('../../common/logger');

class Report {
  async getReports(req, res) {
    logger.info('Getting all the reports for app', req.params.appId);
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await reportService.getReports(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting reports!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.report.get.error,
        },
      });
    }
  }

  async createReport(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Creating new report');
      const result = await reportService.createReport(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error creating new report!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.report.create.error,
        },
      });
    }
  }

  async updateReport(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating report');
      const result = await reportService.updateReport(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating report!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.report.update.error,
        },
      });
    }
  }

  async deleteReport(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting report');
      const result = await reportService.deleteReport(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error deleting report!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.report.delete.error,
        },
      });
    }
  }

  async getLogs(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting report logs');
      const result = await reportService.getLogs(req.params, req.headers.authorization);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting report logs!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.report.logs.error,
        },
      });
    }
  }
}

module.exports = new Report();
