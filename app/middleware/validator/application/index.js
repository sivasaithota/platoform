const ControllerHelper = require('../../../common/controllerHelper');
const logger = require('../../../common/logger');
const filer = require('../../../common/filer');
const constants = require('../../../common/constants');
const validator = require('./validator');
const commonValidator = require('../common');

class Application {
  async validateGetApplication(req, res, next) {
    try {
      validator.validateAppRequestParams(req, constants.application.getDetails.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.application.getDetails.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get applications', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.application.get.error);
    }
  }

  async validateCreateApplication(req, res, next) {
    try {
      validator.validateCreateApplicationRequestBody(req, constants.application.create.bodyInvalid);
      await validator.validateAppNameNotUsed(req, constants.application.create.appExists);
      if (req.body.folderData) await validator.validateApplicationFolderData(req);
      next();
    } catch (errorObject) {
      logger.warning('Cannot create application', errorObject);
      if (req.body.folderData) await filer.deleteDirectory(req.body.folderData.path);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.application.create.error);
    }
  }

  async validateUpdateApplication(req, res, next) {
    try {
      validator.validateAppRequestParams(req, constants.application.update.paramsInvalid);
      validator.validateUpdateApplicationRequestBody(req, constants.application.update.bodyInvalid);
      await commonValidator.application.validateAppExists(req, constants.application.update.noAppId);
      if (req.body.url) await validator.validateAppUrlNotUsed(req, constants.application.update.urlUsed);
      if (req.body.theme) await validator.validateTheme(req, constants.application.update.bodyInvalid);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update application', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.application.update.error);
    }
  }

  async validateDownloadApplication(req, res, next) {
    try {
      validator.validateAppRequestParams(req, constants.application.download.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.application.download.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update application', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.application.download.error);
    }
  }

  async validateDeleteApplication(req, res, next) {
    try {
      validator.validateAppRequestParams(req, constants.application.delete.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.application.delete.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot delete the application', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.application.delete.error);
    }
  }

  async validateGetTags(req, res, next) {
    try {
      validator.validateAppRequestParams(req, constants.application.tags.get.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.application.tags.get.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get tags', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.application.tags.get.error);
    }
  }

  async validateGetScripts(req, res, next) {
    try {
      validator.validateAppRequestParams(req, constants.script.get.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.script.get.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get scripts', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.script.get.error);
    }
  }

  async validateUploadScript(req, res, next) {
    try {
      validator.validateAppRequestParams(req, constants.script.upload.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.script.upload.noAppId);
      await validator.validateScript(req.headers.authorization, req.body, req.params);
      next();
    } catch (errorObject) {
      logger.warning('Cannot upload script', errorObject);
      if (req.body && req.body.fileData) await filer.deleteFile(req.body.fileData.path);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.script.upload.error);
    }
  }

  async validateDeleteScript(req, res, next) {
    try {
      validator.validateAppRequestParams(req, constants.script.delete.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.script.delete.noAppId);
      await validator.validateScriptNotUsedInAction(req, constants.script.delete.scriptInUse);
      next();
    } catch (errorObject) {
      logger.warning('Cannot delete script', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.script.delete.error);
    }
  }

  async validateUploadConfiguration(req, res, next) {
    try {
      validator.validateAppRequestParams(req, constants.application.config.upload.paramsInvalid);
      await commonValidator.application.validateAppExists(req, constants.application.config.upload.noAppId);
      await validator.validateConfigurationRequest(req);
      next();
    } catch (errorObject) {
      logger.warning('Cannot upload configuration', errorObject);
      if (req.body && req.body.fileData) await filer.deleteFile(req.body.fileData.path);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.application.config.upload.error);
    }
  }
}

module.exports = new Application();
