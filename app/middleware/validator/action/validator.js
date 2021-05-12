const commonServices = require('../../../services/common');
const commonValidator = require('../common');
const constants = require('../../../common/constants');
const PropertyValidator = require('../../../common/propertyValidator');
const validationSchema = require('../common/validationSchema');

class Validator {
  async validateActionExists(req, errorMessage) {
    if (!await commonServices.action.checkIfActionExistsById(req.params.appId, req.params.actionId)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateActionDoesNotExist(req, errorMessage) {
    const actionExists = req.body.type === constants.types.action.primary
      ? await commonServices.action.checkIfActionExistsByType(req.params.appId, req.body.type)
      : await commonServices.action.checkIfActionExistsByName(req.params.appId, req.body.name);

    if (actionExists) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateEnvironment(req, errorMessage) {
    const unprovidedProperties = [];
    if (!req.body.environment) unprovidedProperties.push('environment');

    if (unprovidedProperties.length) {
      Object.assign(req.body, await commonServices.action.getActionData(req.params.actionId, ...unprovidedProperties));
    }

    const [environment] = await commonServices.environment.getEnvironments(req.body.environment);
    const invalidProperties = {};

    if (!environment) {
      invalidProperties.environment = 'Must be a valid environment';
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

  validateActionRequestParams(req, errorMessage) {
    const invalidParams = {};
    req.params = req.params || {};

    if (!commonValidator.type.validateObjectId(req.params.appId)) {
      invalidParams.appId = `'${req.params.appId}' is not a invalid Id`;
    } else if (req.params.actionId && !commonValidator.type.validateObjectId(req.params.actionId)) {
      invalidParams.actionId = `'${req.params.actionId}' is not a invalid Id`;
    } else if (req.params.triggerId && !commonValidator.type.validateObjectId(req.params.triggerId)) {
      invalidParams.triggerId = `'${req.params.triggerId}' is not a invalid Id`;
    } else {
      return true;
    }

    const errorObject = {
      code: constants.httpCodes.badRequest,
      result: {
        message: errorMessage,
        invalidParams,
      },
    };
    throw errorObject;
  }

  validateActionRequestBody(req, errorMessage) {
    req.body = req.body || {};

    const ignoreRequired = req.method === 'PATCH';
    const validationResult = new PropertyValidator(validationSchema.actionProperties, { ignoreRequired }).validate(req.body);
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

  validateMoveRequestBody(req, errorMessage) {
    const invalidProperties = {};
    req.body = req.body || {};

    if (!commonValidator.type.validateNumber(req.body.position, true, 0)) {
      invalidProperties.position = 'Position should be an integer value greater than zero';
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

  validateTriggerRequestBody(req, errorMessage) {
    req.body = req.body || {};

    const validationResult = new PropertyValidator(validationSchema.triggerProperties).validate(req.body);
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
