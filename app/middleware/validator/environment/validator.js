const constants = require('../../../common/constants');
const PropertyValidator = require('../../../common/propertyValidator');
const validationSchema = require('../common/validationSchema');
const dataServices = require('../../../dataServices');

class Environment {
  validateEnvironmentType(req, errorMessage) {
    const invalidParams = {};
    req.params = req.params || {};

    if (!(req.params.type in constants.types.environment)) {
      invalidParams.type = 'No such type found';
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

  validateEnvironmentData(req, errorMessage) {
    const validationResult = new PropertyValidator(validationSchema.environmentProperties).validate(req.body);
    if (!validationResult.isValid || Object.entries(validationResult.validatedObject).length === 0) {
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

  async validateEnvironmentName(name, errorMessage) {
    const result = await dataServices.environment.getEnvironments({ name, type: constants.types.environment.custom });
    if (!result.length) return true;
    const errorObject = {
      code: constants.httpCodes.badRequest,
      result: {
        message: errorMessage,
      },
    };
    throw errorObject;
  }

  async validateEnvironmentCount(errorMessage) {
    const { environment: { maxLimit } } = await dataServices.global.getSetting();
    const result = await dataServices.environment.getEnvironments({ type: constants.types.environment.custom });
    if (result.length < maxLimit) return true;
    const errorObject = {
      code: constants.httpCodes.badRequest,
      result: {
        message: errorMessage,
      },
    };
    throw errorObject;
  }

  async validateEnvironmentUserAccess(req, errorMessage) {
    const record = await dataServices.environment.getEnvironmentById(req.params.id, { createdBy: 1, locked: 1 });
    if (!record || (record.locked && record.createdBy !== req.user.username)) {
      const errorObject = {
        code: constants.httpCodes.forbidden,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }
}

module.exports = new Environment();
