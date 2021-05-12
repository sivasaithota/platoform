const commonServices = require('../../../services/common');
const commonValidator = require('../common');
const validationSchema = require('../common/validationSchema');
const PropertyValidator = require('../../../common/propertyValidator');
const constants = require('../../../common/constants');

class Validator {
  async validateScheduleExists(req, errorMessage) {
    if (!await commonServices.schedule.checkScheduleById(req.params.scheduleId)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: { message: errorMessage },
      };
      throw errorObject;
    }
  }

  async validateScheduleDoesNotExist(req, errorMessage) {
    if (await commonServices.schedule.checkScheduleByName(req.body.name, req.params.appId)) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: { message: errorMessage },
      };
      throw errorObject;
    }
  }

  validateScheduleRequestParams(req, errorMessage) {
    const invalidParams = {};
    req.params = req.params || {};

    if (!commonValidator.type.validateObjectId(req.params.appId)) {
      invalidParams.appId = `'${req.params.appId}' is not a valid Id`;
    } else if (req.params.scheduleId && !commonValidator.type.validateObjectId(req.params.scheduleId)) {
      invalidParams.scheduleId = `'${req.params.scheduleId}' is not a valid Id`;
    } else return true;

    const errorObject = {
      code: constants.httpCodes.notFound,
      result: {
        message: errorMessage,
        invalidParams,
      },
    };
    throw errorObject;
  }

  validateScheduleRequestBody(req, errorMessage) {
    req.body = req.body || {};
    const ignoreRequired = req.method === 'PATCH';
    const validationResult = new PropertyValidator(validationSchema.scheduleProperties, { ignoreRequired }).validate(req.body);

    if (!validationResult.isValid) {
      const errorObject = {
        code: constants.httpCodes.badRequest,
        result: {
          message: errorMessage,
          invalidProperties: validationResult.invalidProperties,
        },
      };
      throw errorObject;
    }
    req.body = validationResult.validatedObject;
  }
}

module.exports = new Validator();
