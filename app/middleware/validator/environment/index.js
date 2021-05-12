const validator = require('./validator');
const ControllerHelper = require('../../../common/controllerHelper');
const logger = require('../../../common/logger');
const constants = require('../../../common/constants');

class Environment {
  async validateGetEnvironments(req, res, next) {
    try {
      validator.validateEnvironmentType(req, constants.environment.get.bodyInvalid);
      next();
    } catch (errorObject) {
      logger.warning('Error while validating environment request', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.environment.get.error);
    }
  }

  async validateCreateEnvironment(req, res, next) {
    try {
      validator.validateEnvironmentData(req, constants.environment.create.bodyInvalid);
      await validator.validateEnvironmentName(req.body.name, constants.environment.create.nameExists);
      await validator.validateEnvironmentCount(constants.environment.create.limit);
      next();
    } catch (errorObject) {
      logger.warning('Error while validating environment request', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.environment.create.error);
    }
  }

  async validateUpdateEnvironment(req, res, next) {
    try {
      await validator.validateEnvironmentUserAccess(req, constants.environment.update.noAccess);
      validator.validateEnvironmentData(req, constants.environment.update.bodyInvalid);
      next();
    } catch (errorObject) {
      logger.warning('Error while validating environment request', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.environment.update.error);
    }
  }

  async validateDeleteEnvironment(req, res, next) {
    try {
      await validator.validateEnvironmentUserAccess(req, constants.environment.delete.noAccess);
      next();
    } catch (errorObject) {
      logger.warning('Error while validating environment request', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.environment.delete.error);
    }
  }
}

module.exports = new Environment();
