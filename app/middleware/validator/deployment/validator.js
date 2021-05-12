const constants = require('../../../common/constants');

class Validator {
  validateDeployRequestBody(req, errorMessage) {
    const invalidProperties = {};
    req.body = req.body || {};

    if (!(req.body.deployType in constants.string.deployment.type)) {
      invalidProperties.deployType = 'Invalid deploy type value';
    } else return true;

    const errorObject = {
      code: constants.httpCodes.badRequest,
      result: {
        message: errorMessage,
        invalidProperties,
      },
    };
    throw errorObject;
  }

  verifyAppExist(req, appObject, errorMessage) {
    if (!appObject || !appObject._id || appObject._id.toString() !== req.params.appId) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  verifyNotInProgress(_, appObject, errorMessage) {
    if (appObject.status && appObject.status === constants.string.deployment.status.deploying) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }
}

module.exports = new Validator();
