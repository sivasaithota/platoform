const ControllerHelper = require('../../../common/controllerHelper');
const validator = require('./validator');
const commonService = require('../../../services/common');
const constants = require('../../../common/constants');
const logger = require('../../../common/logger');

class Deployment {
  async validateDeployApp(req, res, next) {
    try {
      validator.validateDeployRequestBody(req, constants.deployment.deploy.typeInvalid);
      const appObject = await commonService.application.getApplicationData(req.params.appId);
      validator.verifyAppExist(req, appObject, constants.deployment.deploy.noAppId);
      validator.verifyNotInProgress(req, appObject, constants.deployment.deploy.inProgress);
      next();
    } catch (errorObject) {
      logger.warning('Error deploying application', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.deployment.deploy.error);
    }
  }

  async validateStopApp(req, res, next) {
    try {
      const appObject = await commonService.application.getApplicationData(req.params.appId);
      validator.verifyAppExist(req, appObject, constants.deployment.stop.noAppId);
      validator.verifyNotInProgress(req, appObject, constants.deployment.stop.inProgress);
      next();
    } catch (errorObject) {
      logger.warning('Error stopping application', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.deployment.stop.error);
    }
  }

  async validateDeployShiny(req, res, next) {
    try {
      const appObject = await commonService.application.getApplicationData(req.params.appId);
      validator.verifyAppExist(req, appObject, constants.deployment.shiny.noAppId);
      next();
    } catch (errorObject) {
      logger.warning('Error deploying shiny report', errorObject);
      new ControllerHelper(res).sendErrorResponse(constants.deployment.shiny.error);
    }
  }
}

module.exports = new Deployment();
