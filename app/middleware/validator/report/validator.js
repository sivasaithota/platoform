const commonServices = require('../../../services/common');
const commonValidator = require('../common');
const validationSchema = require('../common/validationSchema');
const PropertyValidator = require('../../../common/propertyValidator');
const constants = require('../../../common/constants');

class Validator {
  async validateReportExists(req, errorMessage) {
    const reportIdByAppId = await commonServices.report.getReportIdByAppId(req.params.appId);
    if (!reportIdByAppId || req.params.reportId !== reportIdByAppId._id.toString()) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateReportDoesNotExist(req, errorMessage) {
    if (await commonServices.report.getReportIdByAppId(req.params.appId) !== null) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateReportType(req, errorMessage) {
    const invalidProperties = {};
    const template = await commonServices.global.getReportType(req.body.type);

    if (!template) {
      invalidProperties.type = `'${req.body.type}' is not a valid report type`;
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

  async validateShinyReport(req, errorMessage) {
    if ((await commonServices.report.getReportById(req.params.reportId)).type !== constants.types.report.shiny) {
      const errorObject = {
        code: constants.httpCodes.badRequest,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  validateReportRequestParams(req, errorMessage) {
    const invalidParams = {};
    req.params = req.params || {};

    if (!commonValidator.type.validateObjectId(req.params.appId)) {
      invalidParams.appId = `'${req.params.appId}' is not a valid Id`;
    } else if (req.params.reportId && !commonValidator.type.validateObjectId(req.params.reportId)) {
      invalidParams.reportId = `'${req.params.reportId}' is not a valid Id`;
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

  validateReportRequestBody(req, errorMessage) {
    req.body = req.body || {};
    const ignoreRequired = req.method === 'PATCH';
    const validationResult = new PropertyValidator(validationSchema.reportProperties, { ignoreRequired }).validate(req.body);

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
