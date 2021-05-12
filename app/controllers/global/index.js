const globalService = require('../../services/global');
const userService = require('../../services/user');
const constants = require('../../common/constants');
const ControllerHelper = require('../../common/controllerHelper');
const logger = require('../../common/logger');

class Global {
  async getDatatypes(req, res) {
    logger.info('Getting datatypes from the database');
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await globalService.getDatatypes();
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting datatypes!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.global.datatypes.get.error,
        },
      });
    }
  }

  async getParameterTypes(req, res) {
    logger.info('Getting parameter types from the database');
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await globalService.getParameterTypes();
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting parameter types!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.global.parameterTypes.get.error,
        },
      });
    }
  }

  async getReportTypes(req, res) {
    logger.info('Getting report types from the database');
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await globalService.getReportTypes();
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting report types!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.global.reportTypes.get.error,
        },
      });
    }
  }

  async getInfo(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting App Studio OpenX info');
      const result = await globalService.getInfo(req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting App Studio OpenX info!', err);
      controllerHelper.sendErrorResponse({
        message: constants.global.info.get.error,
      });
    }
  }

  async getCheckUnique(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting property uniqueness');
      const result = await globalService.getCheckUnique(req.params, req.query);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting property uniqueness!', err);
      controllerHelper.sendErrorResponse({
        message: constants.global.checkUnique.error,
      });
    }
  }

  async getSetting(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting the global settings');
      const result = await globalService.getSetting();
      const userCount = await userService.getUserCount();
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          userCount,
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting global settings!', err);
      controllerHelper.sendErrorResponse({
        message: constants.global.setting.get.error,
      });
    }
  }

  async updateSetting(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating the global settings');
      const result = await globalService.updateSetting(req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error while updating global settings!', err);
      const errorResponse = err.code && err.result ? err : {
        message: constants.global.setting.update.error,
      };
      controllerHelper.sendErrorResponse(errorResponse);
    }
  }

  async getRoles(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting the role list');
      const result = await userService.getClientRoles();
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting roles!', err);
      controllerHelper.sendErrorResponse({
        result: {
          code: err.response.status,
          message: err.response.data.errorMessage,
        },
      });
    }
  }
}

module.exports = new Global();
