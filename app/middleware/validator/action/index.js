const ControllerHelper = require('../../../common/controllerHelper');
const logger = require('../../../common/logger');
const constants = require('../../../common/constants');
const validator = require('./validator');
const commonValidator = require('../common');

class Action {
  async validateGetActions(req, res, next) {
    try {
      validator.validateActionRequestParams(req, constants.action.get.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.action.get.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get actions', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.action.get.error);
    }
  }

  async validateCreateAction(req, res, next) {
    try {
      validator.validateActionRequestParams(req, constants.action.create.paramsInvalid);
      validator.validateActionRequestBody(req, constants.action.create.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.action.create.noAppId);
      await validator.validateActionDoesNotExist(req, constants.action.create.actionExists);
      if (req.body.environment) await validator.validateEnvironment(req, constants.action.create.bodyInvalid);
      if (req.body.fileName) await commonValidator.application.validateScriptExists(req, constants.action.create.noScript);
      next();
    } catch (errorObject) {
      logger.warning('Cannot create action', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.action.create.error);
    }
  }

  async validateUpdateAction(req, res, next) {
    try {
      validator.validateActionRequestParams(req, constants.action.update.paramsInvalid);
      validator.validateActionRequestBody(req, constants.action.update.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.action.update.noAppId);
      await validator.validateActionExists(req, constants.action.update.noActionId);
      if (req.body.environment) await validator.validateEnvironment(req, constants.action.update.bodyInvalid);
      if (req.body.fileName) await commonValidator.application.validateScriptExists(req, constants.action.update.noScript);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update action', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.action.update.error);
    }
  }

  async validateDeleteAction(req, res, next) {
    try {
      validator.validateActionRequestParams(req, constants.action.delete.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.action.delete.noAppId);
      await validator.validateActionExists(req, constants.action.delete.noActionId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot delete action', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.action.delete.error);
    }
  }

  async validateMoveAction(req, res, next) {
    try {
      validator.validateActionRequestParams(req, constants.action.move.paramsInvalid);
      validator.validateMoveRequestBody(req, constants.action.move.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.action.move.noAppId);
      await validator.validateActionExists(req, constants.action.move.noActionId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot move action', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.action.move.error);
    }
  }

  async validateGetTriggers(req, res, next) {
    try {
      validator.validateActionRequestParams(req, constants.action.trigger.get.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.action.trigger.get.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get trigger', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.action.trigger.get.error);
    }
  }

  async validateSetTrigger(req, res, next) {
    try {
      validator.validateActionRequestParams(req, constants.action.trigger.set.paramsInvalid);
      validator.validateTriggerRequestBody(req, constants.action.trigger.set.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.action.trigger.set.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot set trigger', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.action.trigger.set.error);
    }
  }
}

module.exports = new Action();
