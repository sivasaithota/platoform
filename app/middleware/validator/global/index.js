const ControllerHelper = require('../../../common/controllerHelper');
const logger = require('../../../common/logger');
const constants = require('../../../common/constants');
const validator = require('./validator');

class Global {
  async validateGetCheckUnique(req, res, next) {
    try {
      validator.validateCheckUniqueParams(req, constants.global.checkUnique.paramsInvalid);
      next();
    } catch (errorObject) {
      logger.warning('Cannot get parameters', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.global.checkUnique.error);
    }
  }

  async validateSetting(req, res, next) {
    try {
      validator.validateSettingBody(req, constants.global.setting.update.bodyInvalid);
      if (req.body.tableau) await validator.validateTableau(req, constants.global.setting.update.projectInvalid);
      next();
    } catch (errorObject) {
      logger.warning('Error while validating global setting request', errorObject);
      new ControllerHelper(res).sendErrorResponse(errorObject.result ? errorObject : constants.global.setting.update.error);
    }
  }
}

module.exports = new Global();
