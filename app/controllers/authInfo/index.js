const authInfo = require('../../services/authInfo');
const constants = require('../../common/constants');
const ControllerHelper = require('../../common/controllerHelper');
const logger = require('../../common/logger');

class AuthInfo {
  async getAuthInfo(req, res) {
    const controllerHelper = new ControllerHelper(res);
    try {
      logger.info('Getting list of authorized domains');
      const result = await authInfo.getDomains();
      logger.info('Sending the result to the client.');
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: {
          result,
        },
      });
    } catch (err) {
      logger.error('Error getting authorized domains!', err);
      controllerHelper.sendErrorResponse({
        message: constants.theme.get.error,
      });
    }
  }
}

module.exports = new AuthInfo();
