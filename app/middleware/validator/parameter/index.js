const ControllerHelper = require('../../../common/controllerHelper');
const logger = require('../../../common/logger');
const constants = require('../../../common/constants');
const validator = require('./validator');
const commonValidator = require('../common');

class Parameter {
  async validateGetParameters(req, res, next) {
    try {
      validator.validateParameterGroupRequestParams(req, constants.parameter.get.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.parameter.get.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get parameters', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.parameter.get.error);
    }
  }

  async validateCreateParameterGroup(req, res, next) {
    try {
      validator.validateParameterGroupRequestParams(req, constants.parameter.group.create.paramsInvalid);
      validator.validateParameterGroupRequestBody(req, constants.parameter.group.create.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.parameter.group.create.noAppId);
      await validator.validateParameterGroupNameNotUsed(req, constants.parameter.group.create.nameExists);
      next();
    } catch (errorObject) {
      logger.warning('Cannot create parameter group', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.parameter.group.create.error);
    }
  }

  async validateUpdateParameterGroup(req, res, next) {
    try {
      validator.validateParameterGroupRequestParams(req, constants.parameter.group.update.paramsInvalid);
      validator.validateParameterGroupRequestBody(req, constants.parameter.group.update.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.parameter.group.update.noAppId);
      await validator.validateParameterGroupExists(req, constants.parameter.group.update.noParameterGroup);
      if (req.body.name) await validator.validateParameterGroupNameNotUsed(req, constants.parameter.group.update.nameExists);
      await validator.validateParameterGroupNotDefault(req, constants.parameter.group.update.isDefault);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update parameter group', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.parameter.group.update.error);
    }
  }

  async validateDeleteParameterGroup(req, res, next) {
    try {
      validator.validateParameterGroupRequestParams(req, constants.parameter.group.delete.paramsInvalid);
      validator.validateDeleteParameterGroupRequestQuery(req, constants.parameter.group.delete.queryInvalid);
      await commonValidator.application.validateAppExists(req, constants.parameter.group.delete.noAppId);
      await validator.validateParameterGroupExists(req, constants.parameter.group.delete.noParameterGroup);
      await validator.validateParameterGroupNotDefault(req, constants.parameter.group.delete.isDefault);
      next();
    } catch (errorObject) {
      logger.warning('Cannot delete parameter group', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.parameter.group.delete.error);
    }
  }

  async validateMoveParameterGroup(req, res, next) {
    try {
      validator.validateParameterGroupRequestParams(req, constants.parameter.group.move.paramsInvalid);
      validator.validateMoveParameterGroupRequestBody(req, constants.parameter.group.move.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.parameter.group.move.noAppId);
      await validator.validateParameterGroupExists(req, constants.parameter.group.move.noParameterGroup);
      await validator.validateParameterGroupNotDefault(req, constants.parameter.group.move.isDefault);
      next();
    } catch (errorObject) {
      logger.warning('Cannot move parameter group', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.parameter.group.move.error);
    }
  }

  async validateCreateParameter(req, res, next) {
    try {
      validator.validateParameterRequestParams(req, constants.parameter.create.paramsInvalid);
      validator.validateParameterRequestQuery(req, constants.parameter.create.queryInvalid);
      validator.validateParameterRequestBody(req, constants.parameter.create.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.parameter.create.noAppId);
      await validator.validateParameterGroupExists(req, constants.parameter.create.noParameterGroupId);
      await validator.validateParameterNameNotUsed(req, constants.parameter.create.nameExists);
      await validator.validateParameterType(req, constants.parameter.create.bodyInvalid);
      next();
    } catch (errorObject) {
      logger.warning('Cannot create parameter', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.parameter.create.error);
    }
  }

  async validateUpdateParameter(req, res, next) {
    try {
      validator.validateParameterRequestParams(req, constants.parameter.update.paramsInvalid);
      validator.validateParameterRequestBody(req, constants.parameter.update.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.parameter.update.noAppId);
      await validator.validateParameterGroupExists(req, constants.parameter.update.noParameterGroupId);
      await validator.validateParameterExists(req, constants.parameter.update.parameterDoesNotExist);
      await validator.validateParameterType(req, constants.parameter.update.bodyInvalid);
      if (req.body.name) await validator.validateParameterNameNotUsed(req, constants.parameter.update.nameExists);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update parameter', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.parameter.update.error);
    }
  }

  async validateDeleteParameters(req, res, next) {
    try {
      validator.validateRemoveParametersRequestBody(req, constants.parameter.delete.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.parameter.delete.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot delete parameters', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.parameter.delete.error);
    }
  }

  async validateMoveParameters(req, res, next) {
    try {
      validator.validateParameterRequestParams(req, constants.parameter.move.paramsInvalid);
      validator.validateRemoveParametersRequestBody(req, constants.parameter.move.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.parameter.move.noAppId);
      await validator.validateParameterGroupExists(req, constants.parameter.move.noParameterGroupId);
      await validator.validateParametersNamesUnique(req, constants.parameter.move.nameExists);
      next();
    } catch (errorObject) {
      logger.warning('Cannot move parameters', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.parameter.move.error);
    }
  }
}

module.exports = new Parameter();
