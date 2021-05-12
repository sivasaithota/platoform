const globalDataService = require('../../dataServices').global;
const logger = require('../../common/logger');

class AuthInfo {
  async getDomains() {
    logger.debug('Get the list of domains');
    try {
      const settings = await globalDataService.getSetting('acceptedDomains');
      return settings.acceptedDomains;
    } catch (err) {
      logger.error('Error while getting authorized domains', err);
      throw err;
    }
  }
}

module.exports = new AuthInfo();
