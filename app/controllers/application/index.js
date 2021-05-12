const ControllerHelper = require('../../common/controllerHelper');
const applicationService = require('../../services/application');
const constants = require('../../common/constants');
const logger = require('../../common/logger');
const filer = require('../../common/filer');

class Application {
  async getApplications(req, res) {
    logger.info('Getting all the apps from the database');
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await applicationService.getApplications(req.query, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting all apps!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.application.get.error,
        },
      });
    }
  }

  async getApplication(req, res) {
    logger.info('Getting app details from the database');
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await applicationService.getApplication(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting all apps!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.application.getDetails.error,
        },
      });
    }
  }

  async getApplicationScopes(req, res) {
    logger.info('Getting app scopes from keycloak');
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await applicationService.getApplicationScopes(req.params, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting app scopes!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.application.getDetails.error,
        },
      });
    }
  }

  async createApplication(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Creating new application.');
      const result = await applicationService.createApplication(req.body, req.user);
      logger.info('Sending the result to the client.');
      return controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error creating new application!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.application.create.error,
        },
      });
    } finally {
      if (req.body.folderData) await filer.deleteDirectory(req.body.folderData.path);
    }
  }

  async updateApplication(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating application', req.params.appId);
      const result = await applicationService.updateApplication(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating application!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.application.update.error,
        },
      });
    }
  }

  async downloadApplication(req, res) {
    const controllerHelper = new ControllerHelper(res);
    let appArchivePath;
    try {
      logger.info('Downloading app', req.params.appId);
      appArchivePath = await applicationService.downloadApplication(req.params, req.body, req.headers.authorization);
      logger.info('Sending the result to the client.');
      res.download(appArchivePath, () => filer.deleteFile(appArchivePath));
    } catch (err) {
      logger.error('Error downloading application!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.application.download.error,
        },
      });
    }
  }

  async deleteApplication(req, res) {
    logger.info('Deleting application from the database');
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await applicationService.deleteApplication(req.params, req.query, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error deleting the application!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.application.delete.error,
        },
      });
    }
  }

  async getTags(req, res) {
    logger.info('Getting tags for the app', req.params.appId);
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await applicationService.getTags(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting tags!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.application.tags.get.error,
        },
      });
    }
  }

  async getScripts(req, res) {
    logger.info('Getting all the script names from the database');
    const controllerHelper = new ControllerHelper(res);
    try {
      const result = await applicationService.getScripts(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting script names!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.script.get.error,
        },
      });
    }
  }

  async uploadScript(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Uploading script for app', req.params.appId);
      const result = await applicationService.uploadScript(req.params, req.body);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error uploading script!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.script.upload.error,
        },
      });
    } finally {
      if (req.body.folderData) filer.deleteDirectory(req.body.folderData.path);
      else if (req.body.fileData) filer.deleteFile(req.body.fileData.path);
    }
  }

  async deleteScript(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting script for app', req.params.appId);
      const result = await applicationService.deleteScript(req.params);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error deleting script!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.script.delete.error,
        },
      });
    }
  }

  async uploadConfiguration(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Uploading configuration for app', req.params.appId);
      const result = await applicationService.uploadConfiguration(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error uploading configuration!', err);
      controllerHelper.sendErrorResponse({
        result: {
          message: constants.application.config.upload.error,
        },
      });
    }
  }
}

module.exports = new Application();
