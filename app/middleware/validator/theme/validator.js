const path = require('path');

const validationSchema = require('../common/validationSchema');
const PropertyValidator = require('../../../common/propertyValidator');
const commonServices = require('../../../services/common');
const constants = require('../../../common/constants');

class Validator {
  async validateThemeExists(req, errorMessage) {
    if (!await commonServices.theme.getTheme(req.params.themeId)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateCustomThemeExists(req, errorMessage) {
    if (!await commonServices.theme.getCustomTheme(req.params.themeId)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateThemeNotUsed(req, errorMessage) {
    if (await commonServices.application.getApplicationCountByThemeId(req.params.themeId)) {
      const errorObject = {
        code: constants.httpCodes.notFound,
        result: { message: errorMessage },
      };
      throw errorObject;
    }
  }

  validateThemeImageType(req, errorMessage) {
    if (!constants.types.themeImage.includes(req.query.type)) {
      const errorObject = {
        code: constants.httpCodes.badRequest,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  validateThemeRequestBody(req, errorMessage) {
    req.body = req.body || {};
    const ignoreRequired = req.method === 'PATCH';
    const validationResult = new PropertyValidator(validationSchema.themeProperties, { ignoreRequired }).validate(req.body);

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

    req.body = Object.assign(validationResult.validatedObject, { folderData: req.body.folderData });
  }

  validateThemeImages(req, errorMessage) {
    if (!req.body.folderData.files.every(imagePath => Object.values(req.body.images).includes(path.basename(imagePath)))) {
      const errorObject = {
        code: constants.httpCodes.badRequest,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }
}

module.exports = new Validator();
