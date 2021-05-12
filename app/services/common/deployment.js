const filer = require('../../common/filer');
const logger = require('../../common/logger');
const constants = require('../../common/constants');

class Deployment {
  async getAppConfigById(appId) {
    logger.debug('getting ApplicationConfig file by id', appId);
    const path = `${constants.fs.paths.appRoot}/${appId}/${constants.fs.filenames.applicationConfig}`;
    if (await filer.pathExists(path)) {
      return JSON.parse(await filer.readFile(path));
    }
  }
}

module.exports = new Deployment();
