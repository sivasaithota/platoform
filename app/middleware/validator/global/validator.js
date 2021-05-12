const TableauManager = require('../../../services/report/tableauManager');
const constants = require('../../../common/constants');
const PropertyValidator = require('../../../common/propertyValidator');
const validationSchema = require('../common/validationSchema');

class Validator {
  validateCheckUniqueParams(req, errorMessage) {
    const invalidParams = {};
    req.params = req.params || {};

    if (!(req.params.type in constants.collection.names)) {
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

  validateSettingBody(req, errorMessage) {
    const validationResult = new PropertyValidator(validationSchema.settingProperties).validate(req.body);
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

  async validateTableau(req, errorMessage) {
    const projectId = await new TableauManager(null, req.body.tableau).getProjectId(req.body.tableau.projectName);
    if (!projectId) {
      const errorObject = {
        code: constants.httpCodes.badRequest,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }

    req.body.tableau.projectId = projectId;
  }
}

module.exports = new Validator();
