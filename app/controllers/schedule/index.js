const ControllerHelper = require('../../common/controllerHelper');
const scheduleService = require('../../services/schedule');
const constants = require('../../common/constants');
const logger = require('../../common/logger');

class Schedule {
  async getSchedules(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting schedules from the server');
      const result = await scheduleService.getSchedules(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting schedules!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.schedule.get.error,
        },
      });
    }
  }

  async createSchedule(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Creating new schedule');
      const result = await scheduleService.createSchedule(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error creating new schedule!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.schedule.create.error,
        },
      });
    }
  }

  async updateSchedule(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating schedule');
      const result = await scheduleService.updateSchedule(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating schedule!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.schedule.update.error,
        },
      });
    }
  }

  async deleteSchedule(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting schedule');
      const result = await scheduleService.deleteSchedule(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error deleting schedule!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.schedule.delete.error,
        },
      });
    }
  }
}

module.exports = new Schedule();
