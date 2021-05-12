const themeDataService = require('../../dataServices').theme;
const logger = require('../../common/logger');
const constants = require('../../common/constants');

class Theme {
  recreatePresetThemes(themes) {
    return themeDataService.recreatePresetThemes(themes);
  }

  async getDefaultThemeId() {
    return (await themeDataService.getDefaultThemeId())._id;
  }

  getTheme(themeId) {
    logger.debug('Checking if Theme Id exists', themeId);
    return themeDataService.getTheme(themeId);
  }

  getCustomTheme(themeId) {
    logger.debug('Checking if Custom Theme Id exists', themeId);
    return themeDataService.getTheme(themeId, constants.defaultProperties.customTheme.group);
  }
}

module.exports = new Theme();
