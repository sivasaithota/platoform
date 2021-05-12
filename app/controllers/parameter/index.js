const ControllerHelper = require('../../common/controllerHelper');
const parameterService = require('../../services/parameter');
const constants = require('../../common/constants');
const logger = require('../../common/logger');

class Parameter {
  async getParameters(req, res) {
    logger.info('Getting parameters for the app', req.params.appId);
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await parameterService.getParameters(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting parameters!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.parameter.get.error,
        },
      });
    }
  }

  async createParameterGroup(req, res) {
    logger.info('Creating new parameter group', req.params.appId);
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await parameterService.createParameterGroup(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error creating parameter group!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.parameter.group.create.error,
        },
      });
    }
  }

  async updateParameterGroup(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating parameter group');
      const result = await parameterService.updateParameterGroup(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating parameter group!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.parameter.group.update.error,
        },
      });
    }
  }

  async deleteParameterGroup(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting parameter group');
      const result = await parameterService.deleteParameterGroup(req.params, req.query);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error deleting parameter group!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.parameter.group.delete.error,
        },
      });
    }
  }

  async moveParameterGroup(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Moving parameterGroupId', req.params.parameterGroupId);
      const result = await parameterService.moveParameterGroup(req.params, req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error moving column!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.parameter.group.move.error,
        },
      });
    }
  }

  async createParameter(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Creating new parameter in parameter group', req.params.parameterGroupId);
      const result = await parameterService.createParameter(req.params, req.body, req.user, req.query.position);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error creating new parameter!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.parameter.create.error,
        },
      });
    }
  }

  async updateParameter(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating parameter', req.params.parameterId);
      const result = await parameterService.updateParameter(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating parameter!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.parameter.update.error,
        },
      });
    }
  }

  async deleteParameters(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting parameters');
      const result = await parameterService.deleteParameters(req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error deleting parameters!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.parameter.delete.error,
        },
      });
    }
  }

  async moveParameters(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Moving parameters', req.params.parameterIds);
      const result = await parameterService.moveParameters(req.params, req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error moving parameters!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.parameter.move.error,
        },
      });
    }
  }
}

module.exports = new Parameter();
