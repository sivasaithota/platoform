const commonServices = require('../../../services/common');
const commonValidator = require('../common');
const PropertyValidator = require('../../../common/propertyValidator');
const validationSchema = require('../common/validationSchema');
const constants = require('../../../common/constants');

class Validator {
  async validateParameterGroupExists(req, errorMessage) {
    if (!await commonServices.parameter.checkIfParameterGroupExistsById(req.params)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateParameterExists(req, errorMessage) {
    if (!await commonServices.parameter.checkIfParameterExistsById(req.params)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateParameterGroupNameNotUsed(req, errorMessage) {
    if (await commonServices.parameter.checkIfParameterGroupExistsByName(req.params, req.body.name)) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateParameterGroupNotDefault(req, errorMessage) {
    if (!await commonServices.parameter.checkIfParameterGroupNotDefault(req.params)) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateParameterNameNotUsed(req, errorMessage) {
    if (await commonServices.parameter.checkIfParameterExistsByName(req.params, req.body.name)) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateParameterType(req, errorMessage) {
    if (!req.body.type) {
      req.body.type = (await commonServices.parameter.getParameterData(req.params.parameterId, 'type')).type;
    }

    const template = await commonServices.global.getParameterType(req.body.type);
    const typeValidator = new commonValidator.ParameterType();

    if (!template) {
      typeValidator.result = null;
      typeValidator.invalidProperties.type = 'Must be a valid parameter type';
    } else {
      const unprovidedProperties = template.properties.filter(property => !req.body[property.name]);
      if (unprovidedProperties.length) {
        const dbParameterData = await commonServices.parameter.getParameterData(
          req.params.parameterId, ...unprovidedProperties.map(property => property.name),
        );
        Object.assign(req.body, dbParameterData);
      }
      typeValidator.validate(req.body);
    }

    if (!typeValidator.result) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
          invalidProperties: typeValidator.invalidProperties,
        },
      };
      throw errorObject;
    }
  }

  validateParameterGroupRequestParams(req, errorMessage) {
    const invalidParams = {};
    req.params = req.params || {};

    if (!commonValidator.type.validateObjectId(req.params.appId)) {
      invalidParams.appId = `'${req.params.appId}' is not a valid Id`;
    } else if (req.params.parameterGroupId && !commonValidator.type.validateObjectId(req.params.parameterGroupId)) {
      invalidParams.parameterGroupId = `'${req.params.parameterGroupId}' is not a valid Id`;
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

  validateParameterGroupRequestBody(req, errorMessage) {
    req.body = req.body || {};
    const ignoreRequired = req.method === 'PATCH';
    const validationResult = new PropertyValidator(validationSchema.parameterGroupProperties, { ignoreRequired }).validate(req.body);

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

  validateParameterRequestParams(req, errorMessage) {
    const invalidParams = {};
    req.params = req.params || {};

    if (!commonValidator.type.validateObjectId(req.params.appId)) {
      invalidParams.appId = `'${req.params.appId}' is not a valid Id`;
    } else if (!commonValidator.type.validateObjectId(req.params.parameterGroupId)) {
      invalidParams.parameterGroupId = `'${req.params.parameterGroupId}' is not a valid Id`;
    } else if (req.params.parameterId && !commonValidator.type.validateObjectId(req.params.parameterId)) {
      invalidParams.parameterId = `'${req.params.parameterId}' is not a valid Id`;
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

  validateParameterRequestQuery(req, errorMessage) {
    const invalidQueryValues = {};
    req.query = req.query || {};

    if (req.query.position != null && !commonValidator.type.validateNumber(parseInt(req.query.position, 10), true, 0)) {
      invalidQueryValues.position = 'Position should be a non-negative integer value';
    } else return true;

    const errorObject = {
      code: constants.httpCodes.notFound,
      result: {
        message: errorMessage,
        invalidQueryValues,
      },
    };
    throw errorObject;
  }

  validateParameterRequestBody(req, errorMessage) {
    req.body = req.body || {};
    const ignoreRequired = req.method === 'PATCH';
    const validationResult = new PropertyValidator(validationSchema.parameterProperties, { ignoreRequired }).validate(req.body);

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

  validateDeleteParameterGroupRequestQuery(req, errorMessage) {
    const invalidQueryValues = {};
    req.query = req.query || {};

    if (req.query.parametersMovedToGroupId && !commonValidator.type.validateObjectId(req.query.parametersMovedToGroupId, true, 0)) {
      invalidQueryValues.parametersMovedToGroupId = 'Should be a valid Object Id';
    } else return true;

    const errorObject = {
      code: constants.httpCodes.notFound,
      result: {
        message: errorMessage,
        invalidQueryValues,
      },
    };
    throw errorObject;
  }

  validateMoveParameterGroupRequestBody(req, errorMessage) {
    const invalidProperties = {};
    req.body = req.body || {};

    if (!commonValidator.type.validateNumber(req.body.position, true, 0)) {
      invalidProperties.position = 'Position should be an integer value greater than zero';
    } else return true;

    const errorObject = {
      code: constants.httpCodes.notFound,
      result: {
        message: errorMessage,
        invalidProperties,
      },
    };
    throw errorObject;
  }

  validateRemoveParametersRequestBody(req, errorMessage) {
    const invalidProperties = {};
    req.body = req.body || {};

    if (!commonValidator.type.validateObject(req.body.parameterMap)) {
      invalidProperties.parameterMap = 'Must be a non-empty object';
    } else if (req.body.position != null && !commonValidator.type.validateNumber(req.body.position, true, 0)) {
      invalidProperties.position = 'Position should be an integer value greater than zero';
    } else {
      Object.entries(req.body.parameterMap).every(([parameterGroupId, parameterIds]) => {
        if (!commonValidator.type.validateObjectId(parameterGroupId)) {
          invalidProperties.parameterMap = { parameterGroupId: 'Key must be a 24 character hexadecimal Object Id' };
        } else if (!commonValidator.type.validateArray(parameterIds, 1)) {
          invalidProperties.parameterMap = { parameterGroupId: 'Must be a non-empty array of Parameter Ids' };
        } else if (!parameterIds.every(parameterId => commonValidator.type.validateObjectId(parameterId))) {
          invalidProperties.parameterMap = { parameterGroupId: 'Array must contain only valid 24 character hexadecimal Object Ids' };
        } else return true;
        return false;
      });
    }

    if (Object.keys(invalidProperties).length > 0) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
          invalidProperties,
        },
      };
      throw errorObject;
    }
  }

  async validateParametersNamesUnique(req, errorMessage) {
    if (await commonServices.parameter.checkIfParametersUnique(req.params, req.body.parameterMap)) {
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
