const themeService = require('../../services/theme');
const commonServices = require('../../services/common');
const constants = require('../../common/constants');
const ControllerHelper = require('../../common/controllerHelper');
const logger = require('../../common/logger');
const filer = require('../../common/filer');

class Theme {
  async getThemes(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting list of themes');
      const result = await themeService.getThemes();
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting themes!', err);
      controllerHelper.sendErrorResponse({
        message: constants.theme.get.error,
      });
    }
  }

  async createTheme(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Creating theme');
      const result = await themeService.createTheme(req.body, req.user);
      logger.info('Sending the result to the client.');
      return controllerHelper.sendResponse({
        code: constants.httpCodes.successfulCreate,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error creating theme!', err);
      controllerHelper.sendErrorResponse({
        message: constants.theme.create.error,
      });
    } finally {
      if (req.body.folderData) filer.deleteDirectory(req.body.folderData.path);
    }
  }

  async updateTheme(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating theme');
      const result = await themeService.updateTheme(req.params, req.body, req.user);
      logger.info('Sending the result to the client.');
      return controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error updating theme!', err);
      controllerHelper.sendErrorResponse({
        message: constants.theme.update.error,
      });
    } finally {
      if (req.body.folderData) filer.deleteDirectory(req.body.folderData.path);
    }
  }

  async deleteTheme(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Deleting theme');
      const result = await themeService.deleteTheme(req.params);
      logger.info('Sending the result to the client.');
      return controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error deleting theme!', err);
      controllerHelper.sendErrorResponse({
        message: constants.theme.delete.error,
      });
    } finally {
      if (req.body.folderData) filer.deleteDirectory(req.body.folderData.path);
    }
  }

  async getThemeImage(req, res) {
    // Send the image in response
    const theme = await commonServices.theme.getTheme(req.params.themeId);
    if (theme.group === constants.defaultProperties.customTheme.group) {
      return res.sendFile(
        `${constants.fs.paths.appRoot}/${constants.fs.directories.enframe.images.theme}/${req.params.themeId}`
          + `/${theme.images[req.query.type]}`,
      );
    }
    return res.sendFile(
      `${constants.fs.paths.enframeRoot}/${constants.fs.directories.enframe.images.theme_bg}/${theme.images[req.query.type]}`,
    );
  }

  async updateThemeImage(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Updating theme image');
      const result = await themeService.updateThemeImage(req.params, req.query, req.body.fileData, req.user);
      logger.info('Sending the result to the client.');
      return controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      if (req.body.fileData) filer.deleteFile(req.body.fileData.path);
      logger.error('Error updating theme image!', err);
      controllerHelper.sendErrorResponse({
        message: constants.theme.image.error,
      });
    }
  }
}

module.exports = new Theme();
