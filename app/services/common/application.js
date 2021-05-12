const applicationDataService = require('../../dataServices').application;
const logger = require('../../common/logger');

class Application {
  getApplicationData(appId, ...applicationProperties) {
    logger.debug('Getting application data by id', appId);
    return applicationDataService.getApplicationData(appId, applicationProperties);
  }

  async checkIfAppExistsByName(appName) {
    logger.info('Checking if app exists by name');
    const result = await applicationDataService.getAppByName(appName);
    const appExists = result && result.name === appName;
    logger.info(appExists ? 'App exists' : 'App does not exist');
    return appExists;
  }

  async checkIfAppExistsById(appId) {
    logger.info('Checking if app exists by id');
    const result = await applicationDataService.getApplicationData(appId);
    const appExists = result && result._id.toString() === appId;
    logger.info(appExists ? 'App exists' : 'App does not exist');
    return appExists;
  }

  async checkIfOtherAppExistsByUrl(appId, url) {
    logger.info('Checking if another app exists with the same url');
    const result = await applicationDataService.getAppIdByUrl(url);
    const otherAppExists = result && result._id && result._id.toString() !== appId;
    logger.info(otherAppExists ? 'Another app exists' : 'Another app does not exist');
    return otherAppExists;
  }

  async checkIfTagExistsByName(appId, tagName) {
    logger.info('Checking if tag exists by name');
    const result = await applicationDataService.getTagByName(appId, tagName);
    const tagExists = result && result.name === tagName;
    logger.info(tagExists ? 'Tag exists' : 'Tag does not exist');
    return tagExists;
  }

  async checkIfTagExists(appId, tagObject, tagType) {
    logger.info('Checking if tag exists');
    const result = await applicationDataService.getTag(appId, tagObject);
    const tagExists = result && result.type === tagType;
    logger.info(tagExists ? 'Tag exists' : 'Tag does not exist');
    return tagExists;
  }

  async checkIfScriptExists(appId, fileName) {
    logger.info('Checking if tag exists by name');
    const result = await applicationDataService.getAppIdByScriptName(appId, fileName);
    const scriptExists = result && result._id.toString() === appId;
    logger.info(scriptExists ? 'File exists' : 'File does not exist');
    return scriptExists;
  }

  getApplicationCountByThemeId(property, value) {
    logger.info('Getting count of applications by property', property);
    return applicationDataService.getApplicationCountByThemeId(property, value);
  }
}

module.exports = new Application();
