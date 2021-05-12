const ControllerHelper = require('../../common/controllerHelper');
const constants = require('../../common/constants');

class Health {
  async checkHealth(req, res) {
    const controllerHelper = new ControllerHelper(res);

    try {
      controllerHelper.sendResponse({
        code: constants.httpCodes.success,
        result: constants.health.healthy,
      });
    } catch (err) {
      controllerHelper.sendErrorResponse({
        code: constants.httpCodes.success,
        result: constants.health.healthy,
      });
    }
  }
}

module.exports = new Health();
