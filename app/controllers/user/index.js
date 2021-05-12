const userService = require('../../services/user');
const constants = require('../../common/constants');
const ControllerHelper = require('../../common/controllerHelper');
const logger = require('../../common/logger');

class User {
  async getUsers(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting the user list');
      const { users, count } = await userService.getUsers(req.query);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result: users,
          count,
        },
      });
    } catch (err) {
      logger.error('Error getting users!', err);
      controllerHelper.sendErrorResponse({
        code: err.response.status,
        message: err.response.data.errorMessage,
      });
    }
  }

  async getUser(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting user information from keycloak');
      const result = await userService.getUser(req.params.userId);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting user!', err);
      controllerHelper.sendErrorResponse({
        code: err.response.status,
        message: err.response.data.errorMessage,
      });
    }
  }

  async createUser(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Creating new user.');
      const result = await userService.addUser(req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error creating user!', err);
      controllerHelper.sendErrorResponse({
        result: {
          code: err.response.status,
          message: err.response.data.errorMessage,
        },
      });
    }
  }

  async updateUser(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating user in keycloak.');
      await userService.updateUser(req.params.userId, req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          message: constants.user.update.success,
        },
      });
    } catch (err) {
      logger.error('Error updating user!', err);
      controllerHelper.sendErrorResponse({
        result: {
          code: err.response.status,
          message: err.response.data.errorMessage,
        },
      });
    }
  }

  async deleteUser(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting user from keycloak.');
      await userService.deleteUser(req.body, req.user.sub);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          message: constants.user.delete.success,
        },
      });
    } catch (err) {
      logger.error('Error deleting user!', err);
      controllerHelper.sendErrorResponse({
        result: {
          code: err.status,
          message: err.message,
        },
      });
    }
  }
}

module.exports = new User();
