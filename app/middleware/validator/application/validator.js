const commonServices = require('../../../services/common');
const commonValidator = require('../common');
const constants = require('../../../common/constants');
const PropertyValidator = require('../../../common/propertyValidator');
const ConfigValidator = require('./configValidator');
const validationSchema = require('../common/validationSchema');
const Scan = require('../../parser/scanner');

class Validator {
  async validateAppNameNotUsed(req, errorMessage) {
    if (await commonServices.application.checkIfAppExistsByName(req.body.name)) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateAppUrlNotUsed(req, errorMessage) {
    if (await commonServices.application.checkIfOtherAppExistsByUrl(req.params.appId, req.body.url)) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateTheme(req, errorMessage) {
    const invalidProperties = {};
    if (!req.body.theme.id) {
      req.body.theme = {
        ...(await commonServices.application.getApplicationData(req.params.appId, 'theme')).theme,
        ...req.body.theme,
      };
    }

    const theme = await commonServices.theme.getTheme(req.body.theme.id);

    if (!theme) {
      invalidProperties.id = 'No theme found with the provided theme ID';
    } else if (!theme.colorSchemes[req.body.theme.colorIndex || 0]) {
      invalidProperties.colorIndex = 'The provided color index does not exist for this theme';
    } else return true;

    const errorObject = {
      code: constants.httpCodes.conflict,
      result: {
        message: errorMessage,
        invalidProperties,
      },
    };
    throw errorObject;
  }

  async validateScript(token, requestBody, paramsObject) {
    try {
      const scan = new Scan();
      if (requestBody.folderData) {
        await scan.scanPython(token, requestBody.folderData.path, [paramsObject.appId]);
      } else {
        await scan.scanPython(token, requestBody.fileData.path, [paramsObject.appId, requestBody.fileData.name]);
      }
    } catch (error) {
      const errorObject = {
        code: constants.httpCodes.badRequest,
        result: {
          message: error,
        },
      };
      throw errorObject;
    }
  }

  async validateScriptNameNotUsed(req, errorMessage) {
    if (await commonServices.application.checkIfScriptExists(req.params.appId, req.body.fileData.name)) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  async validateScriptNotUsedInAction(req, errorMessage) {
    if (await commonServices.action.checkIfActionExistsByScriptName(req.params.appId, req.params.fileName)) {
      const errorObject = {
        code: constants.httpCodes.conflict,
        result: {
          message: errorMessage,
        },
      };
      throw errorObject;
    }
  }

  validateAppRequestParams(req, errorMessage) {
    const invalidParams = {};
    req.params = req.params || {};

    if (!commonValidator.type.validateObjectId(req.params.appId)) {
      invalidParams.appId = `'${req.params.appId}' is not a invalid Id`;
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

  validateCreateApplicationRequestBody(req, errorMessage) {
    req.body = req.body || {};

    const validationResult = new PropertyValidator(validationSchema.createApplicationProperties).validate(req.body);
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

  validateUpdateApplicationRequestBody(req, errorMessage) {
    req.body = req.body || {};

    const validationResult = new PropertyValidator(validationSchema.updateApplicationProperties).validate(req.body);
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

  async validateConfigurationRequest(req) {
    req.body = req.body || {};

    const configValidator = new ConfigValidator();
    await configValidator.validate(req.body);
    if (configValidator.error) {
      const errorObject = {
        code: constants.httpCodes.badRequest,
        result: {
          message: configValidator.error,
        },
      };
      throw errorObject;
    }
    req.body = configValidator.validatedConfig;
  }

  async validateApplicationFolderData(req) {
    const { config, tableData } = req.body;
    let error;

    if (config.tables) {
      config.tables.every((table) => {
        const { name, columns } = table;

        if (!(name in tableData)) {
          if (table.filename) {
            error = `Missing file '${table.fileName}'`;
          }
        } else if (columns.length !== tableData[name].columns.length) {
          error = `Mismatch in number of columns between config and CSV file for table '${name}'`;
        } else if (table.columns.some((col, index) => ![col.name, col.displayName].includes(tableData[name].columns[index].name))) {
          error = `Mismatch in column names between config and CSV file for table '${name}'`;
        } else return true;

        return false;
      });
    }

    if (!error) {
      const configValidator = new ConfigValidator();
      await configValidator.validate(config);
      if (!configValidator.error) {
        req.body.config = configValidator.validatedConfig;
      } else {
        ({ error } = configValidator);
      }
    }

    if (error) {
      const errorObject = {
        code: constants.httpCodes.badRequest,
        result: {
          message: error,
        },
      };
      throw errorObject;
    }
  }
}

module.exports = new Validator();
