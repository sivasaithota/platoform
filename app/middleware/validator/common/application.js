const commonServices = require('../../../services/common');
const constants = require('../../../common/constants');

class Application {
  async validateAppExists(req, errorMessage) {
    if (!await commonServices.application.checkIfAppExistsById(req.params.appId)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateScriptExists(req, errorMessage) {
    if (!await commonServices.application.checkIfScriptExists(req.params.appId, req.body.fileName)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }
}

module.exports = new Application();
