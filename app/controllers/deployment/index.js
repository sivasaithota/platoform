const ControllerHelper = require('../../common/controllerHelper');
const deploymentService = require('../../services/deployment');
const constants = require('../../common/constants');
const logger = require('../../common/logger');

class Deployment {
  async deploy(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deploying app', req.params.appId);
      const result = await deploymentService.deploy(req.params, req.body, req.user);
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error while deploying!!', err);
      controllerHelper.sendErrorResponse({
        message: constants.deployment.errorDeployingApp,
      });
    }
  }

  async stop(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Stopping app', req.params.appId);
      const result = await deploymentService.stop(req.params, req.user);
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error while deploying!!', err);
      controllerHelper.sendErrorResponse({
        message: constants.deployment.stop.error,
      });
    }
  }

  async deployShiny(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deploying shiny report', req.params.appId);
      const result = await deploymentService.deployShiny(req.params, req.body.folderData, req.headers.authorization);
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error while deploying shiny report!', err);
      controllerHelper.sendErrorResponse({
        message: constants.deployment.shiny.error,
      });
    }
  }
}

module.exports = new Deployment();
