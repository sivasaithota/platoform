const ControllerHelper = require('../../../common/controllerHelper');
const logger = require('../../../common/logger');
const constants = require('../../../common/constants');
const validator = require('./validator');
const commonValidator = require('../common');

class Report {
  async validateGetReports(req, res, next) {
    try {
      validator.validateReportRequestParams(req, constants.report.get.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.report.get.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get reports', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.report.get.error);
    }
  }

  async validateCreateReport(req, res, next) {
    try {
      validator.validateReportRequestParams(req, constants.report.create.paramsInvalid);
      validator.validateReportRequestBody(req, constants.report.create.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.report.create.noAppId);
      await validator.validateReportDoesNotExist(req, constants.report.create.reportExists);
      await validator.validateReportType(req, constants.report.create.bodyInvalid);
      next();
    } catch (errorObject) {
      logger.warning('Cannot create report', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.report.create.error);
    }
  }

  async validateUpdateReport(req, res, next) {
    try {
      validator.validateReportRequestParams(req, constants.report.update.paramsInvalid);
      validator.validateReportRequestBody(req, constants.report.update.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.report.update.noAppId);
      await validator.validateReportExists(req, constants.report.update.noReportId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update report', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.report.update.error);
    }
  }

  async validateDeleteReport(req, res, next) {
    try {
      validator.validateReportRequestParams(req, constants.report.delete.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.report.delete.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot delete report', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.report.delete.error);
    }
  }

  async validateGetLogs(req, res, next) {
    try {
      validator.validateReportRequestParams(req, constants.report.logs.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.report.logs.noAppId);
      await validator.validateReportExists(req, constants.report.logs.noReportId);
      await validator.validateShinyReport(req, constants.report.logs.notShiny);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get report logs', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.report.logs.error);
    }
  }
}

module.exports = new Report();
