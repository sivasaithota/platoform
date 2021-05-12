const ControllerHelper = require('../../../common/controllerHelper');
const validator = require('./validator');
const logger = require('../../../common/logger');
const filer = require('../../../common/filer');
const constants = require('../../../common/constants');

class Theme {
  async validateCreateTheme(req, res, next) {
    try {
      validator.validateThemeRequestBody(req, constants.theme.create.bodyInvalid);
      validator.validateThemeImages(req, constants.theme.create.noImage);
      next();
    } catch (errorObject) {
      logger.warning('Cannot create theme', errorObject);
      if (req.body.folderData) filer.deleteDirectory(req.body.folderData.path);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.theme.create.error);
    }
  }

  async validateUpdateTheme(req, res, next) {
    try {
      validator.validateThemeRequestBody(req, constants.theme.update.bodyInvalid);
      await validator.validateCustomThemeExists(req, constants.theme.update.noThemeId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update theme', errorObject);
      if (req.body.folderData) filer.deleteDirectory(req.body.folderData.path);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.theme.update.error);
    }
  }

  async validateDeleteTheme(req, res, next) {
    try {
      await validator.validateCustomThemeExists(req, constants.theme.delete.noThemeId);
      await validator.validateThemeNotUsed(req, constants.theme.delete.themeUsed);
      next();
    } catch (errorObject) {
      logger.warning('Cannot delete theme', errorObject);
      if (req.body.folderData) filer.deleteDirectory(req.body.folderData.path);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.theme.delete.error);
    }
  }

  async validateGetThemeImage(req, res, next) {
    try {
      validator.validateThemeImageType(req, constants.theme.image.get.typeInvalid);
      await validator.validateThemeExists(req, constants.theme.image.get.noThemeId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get theme image', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.theme.image.get.error);
    }
  }

  async validateUpdateThemeImage(req, res, next) {
    try {
      validator.validateThemeImageType(req, constants.theme.image.update.typeInvalid);
      await validator.validateCustomThemeExists(req, constants.theme.image.update.noThemeId);
      next();
    } catch (errorObject) {
      logger.warning('Cannot update theme image', errorObject);
      if (req.body.fileData) filer.deleteFile(req.body.fileData.path);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.theme.image.update.error);
    }
  }
}

module.exports = new Theme();
