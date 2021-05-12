const constants = require('../../common/constants');
const logger = require('../../common/logger');
const ControllerHelper = require('../../common/controllerHelper');
const actionService = require('../../services/action');


class Action {
  async getActions(req, res) {
    logger.info('Getting actions from the database');
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await actionService.getActions(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting actions!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.action.get.error,
        },
      });
    }
  }

  async createAction(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Inseting action into database', req.params.appId);
      const result = await actionService.createAction(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error inserting action!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.action.create.error,
        },
      });
    }
  }

  async updateAction(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating action for app', req.params.appId);
      const result = await actionService.updateAction(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating action!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.update.error,
        },
      });
    }
  }

  async deleteAction(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting action', req.params);
      const result = await actionService.deleteAction(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error deleting action!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.action.delete.error,
        },
      });
    }
  }

  async moveAction(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Moving action', { ...req.params, ...req.body });
      const result = await actionService.moveAction(req.params, req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error moving action!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.action.move.error,
        },
      });
    }
  }

  async getTriggers(req, res) {
    logger.info('Getting triggers from the database');
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await actionService.getTriggers(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting triggers!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.action.trigger.get.error,
        },
      });
    }
  }

  async setTrigger(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Setting trigger', req.params);
      const result = await actionService.setTrigger(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error setting trigger!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.action.trigger.set.error,
        },
      });
    }
  }
}

module.exports = new Action();
