const commonServices = require('../../../services/common');
const commonValidator = require('../common');
const validationSchema = require('../common/validationSchema');
const PropertyValidator = require('../../../common/propertyValidator');
const constants = require('../../../common/constants');

class Validator {
  validateColumnName(name) {
    return commonValidator.type.validateString(name, /^[^'",&]+$/);
  }

  async validateTableNameNotUsed(req, errorMessage) {
    if (await commonServices.table.checkIfTableExistsByName(req.params, req.body.name)) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateTableExists(req, errorMessage) {
    if (!await commonServices.table.checkIfTableExistsById(req.params.tableId)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateColumnNameNotUsed(req, errorMessage) {
    if (await commonServices.table.checkIfColumnExistsByName(req.params.tableId, req.body.name)) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateColumnExists(req, errorMessage) {
    if (!await commonServices.table.checkIfColumnExistsById(req.params.tableId, req.params.columnId)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateDatatype(req, errorMessage) {
    const validationResult = await commonValidator.table.validateDatatype(req.body, req.params);

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
  }

  validateGetTableRequestQuery(req, errorMessage) {
    const invalidQueryParams = {};
    req.params = req.params || {};

    if (req.query.type && !constants.types.table.includes(req.query.type)) {
      invalidQueryParams.type = `'${req.query.type}' is not a valid table type`;
    } else return true;

    const errorObject = {
      code: constants.httpCodes.notFound,
      result: {
        message: errorMessage,
        invalidQueryParams,
      },
    };
    throw errorObject;
  }

  validateTableRequestParams(req, errorMessage) {
    const invalidParams = {};
    req.params = req.params || {};

    if (!commonValidator.type.validateObjectId(req.params.appId)) {
      invalidParams.appId = `'${req.params.appId}' is not a valid Id`;
    } else if (req.params.tableId && !commonValidator.type.validateObjectId(req.params.tableId)) {
      invalidParams.tableId = `'${req.params.tableId}' is not a valid Id`;
    } else if (req.params.newPosition && !commonValidator.type.validateNumber(parseInt(req.params.newPosition, 10), true, 0)) {
      invalidParams.newPosition = `'${req.params.newPosition}' is not a valid position`;
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

  validateTableRequestBody(req) {
    req.body = req.body || {};
    const ignoreRequired = req.method === 'PATCH';
    const validationResult = new PropertyValidator(validationSchema.tableProperties, { ignoreRequired }).validate(req.body);

    if (!validationResult.isValid) {
      const [invalidProperty, error] = Object.entries(validationResult.invalidProperties)[0];
      const errorObject = {
        code: constants.httpCodes.badRequest,
        result: {
          message: `Table data contains invalid ${invalidProperty} - ${error}`,
          invalidProperties: validationResult.invalidProperties,
        },
      };
      throw errorObject;
    }
    req.body = Object.assign(validationResult.validatedObject, { fileData: req.body.fileData });
  }



  validateColumnRequestParams(req, errorMessage) {
    const invalidParams = {};
    req.params = req.params || {};

    if (req.params.appId && !commonValidator.type.validateObjectId(req.params.appId)) {
      invalidParams.appId = `'${req.params.appId}' is not a valid Id`;
    } else if (!commonValidator.type.validateObjectId(req.params.tableId)) {
      invalidParams.tableId = `'${req.params.tableId}' is not a valid Id`;
    } else if (req.params.columnId && !commonValidator.type.validateObjectId(req.params.columnId)) {
      invalidParams.columnId = `'${req.params.columnId}' is not a valid Id`;
    } else return true;

    const errorObject = {
      code: constants.httpCodes.badRequest,
      result: {
        message: errorMessage,
        invalidParams,
      },
    };
    throw errorObject;
  }

  validateColumnRequestBody(req, errorMessage) {
    req.body = req.body || {};
    const ignoreRequired = req.method === 'PATCH';
    const validationResult = new PropertyValidator(validationSchema.columnProperties, { ignoreRequired }).validate(req.body);

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

  validateMoveTableRequestBody(req) {
    const validationResult = new PropertyValidator(validationSchema.moveTableProperties).validate(req.body);

    if (!validationResult.isValid) {
      const [invalidProperty, error] = Object.entries(validationResult.invalidProperties)[0];
      const errorObject = {
        code: constants.httpCodes.badRequest,
        result: {
          message: `Table data contains invalid ${invalidProperty} - ${error}`,
          invalidProperties: validationResult.invalidProperties,
        },
      };
      throw errorObject;
    }
    req.body = Object.assign(validationResult.validatedObject, { fileData: req.body.fileData });
  }

  validateMoveColumnRequestBody(req, errorMessage) {
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

  async validateFiltersCount(req, errorMessage) {
    if (
      req.body.hasFilter && !await commonValidator.table.validateFiltersCount(req.body, req.params)
    ) {
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
