const ControllerHelper = require('../../../common/controllerHelper');
const logger = require('../../../common/logger');
const constants = require('../../../common/constants');
const validator = require('./validator');
const commonValidator = require('../common');

class Schedule {
  async validateGetSchedules(req, res, next) {
    try {
      validator.validateScheduleRequestParams(req, constants.schedule.get.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.schedule.get.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get schedules', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.schedule.get.error);
    }
  }

  async validateCreateSchedule(req, res, next) {
    try {
      validator.validateScheduleRequestParams(req, constants.schedule.create.paramsInvalid);
      validator.validateScheduleRequestBody(req, constants.schedule.create.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.schedule.create.noAppId);
      await validator.validateScheduleDoesNotExist(req, constants.schedule.create.scheduleExists);
      next();
    } catch (errorObject) {
      logger.warning('Cannot create schedule', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.schedule.create.error);
    }
  }

  async validateUpdateSchedule(req, res, next) {
    try {
      validator.validateScheduleRequestParams(req, constants.schedule.update.paramsInvalid);
      validator.validateScheduleRequestBody(req, constants.schedule.update.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.schedule.update.noAppId);
      await validator.validateScheduleExists(req, constants.schedule.update.noScheduleId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update schedule', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.schedule.update.error);
    }
  }

  async validateDeleteSchedule(req, res, next) {
    try {
      validator.validateScheduleRequestParams(req, constants.schedule.delete.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.schedule.delete.noAppId);
      await validator.validateScheduleExists(req, constants.schedule.delete.noScheduleId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot delete schedule', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.schedule.delete.error);
    }
  }
}

module.exports = new Schedule();
