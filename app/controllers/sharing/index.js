const ControllerHelper = require('../../common/controllerHelper');
const applicationService = require('../../services/application');
const constants = require('../../common/constants');
const logger = require('../../common/logger');

class Share {
  async getSharedUsers(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Retriving shared users for the app', req.params.appId);
      const { users, count } = await applicationService.getSharedUsers(req.params, req.query);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result: users,
          count,
        },
      });
    } catch (err) {
      logger.error('Error retrieving shared users!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: err.response.data.error_description,
        },
      });
    }
  }

  async getSharedUserCount(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Retriving shared users count for the app', req.params.appId);
      const result = await applicationService.getSharedUserCount(req.params, req.query);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error retrieving shared user count!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: err.response.data.error_description,
        },
      });
    }
  }

  async addShare(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Sharing resource to the user', req.params.appId);
      const result = await applicationService.addShare(req.params, req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error sharing application!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: err.response.data.error_description,
        },
      });
    }
  }

  async updateShare(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating resource share', req.params.appId);
      const result = await applicationService.updateShare(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating sharing!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: err.response.data.error_description,
        },
      });
    }
  }

  async removeShare(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating resource share', req.params.appId);
      const result = await applicationService.removeShare(req.params, req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating sharing!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: err.response.data.error_description,
        },
      });
    }
  }
}

module.exports = new Share();
