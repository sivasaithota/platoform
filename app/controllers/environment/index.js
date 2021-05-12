const environmentService = require('../../services/environment');
const constants = require('../../common/constants');
const ControllerHelper = require('../../common/controllerHelper');
const logger = require('../../common/logger');

class Environment {
  async getEnvironments(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting all environments');
      const result = await environmentService.getEnvironments(req.params, req.query);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result,
      });
    } catch (err) {
      logger.error('Error getting all environments!', err);
      controllerHelper.sendErrorResponse({
        message: constants.environment.get.error,
      });
    }
  }

  async createEnvironment(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Creating new execution environment');
      const result = await environmentService.createEnvironment(req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result,
      });
    } catch (err) {
      logger.error('Error encountered while creating new environment!', err);
      controllerHelper.sendErrorResponse({
        message: constants.environment.create.error,
      });
    }
  }

  async updateEnvironment(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating execution environment');
      const result = await environmentService.updateEnvironment(req.body, req.user, req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result,
      });
    } catch (err) {
      logger.error('Error encountered while updating environment!', err);
      controllerHelper.sendErrorResponse({
        message: constants.environment.update.error,
      });
    }
  }

  async deleteEnvironment(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting execution environment');
      const result = await environmentService.deleteEnvironment(req.headers.authorization, req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result,
      });
    } catch (err) {
      logger.error('Error encountered while deleting environment!', err);
      controllerHelper.sendErrorResponse({
        message: constants.environment.delete.error,
      });
    }
  }
}

module.exports = new Environment();
