// Service for validations

import Ajv from 'ajv';

import configSchema from '../configs/appConfigSchemas';
import common from './common';
import message from './message';

export default {
  // Validating the passed config file
  validateConfig: configFile => {
    // reading the config file content
    return common.readFile(configFile).then(fileContent => {
      let configJson;
      const fileNameWithoutExtension = configFile.name.split('.')[0];

      // trying to parse the contents of the json config file
      try {
        configJson = JSON.parse(fileContent);
      } catch (err) {
        return err.message;
      }

      // analyticsCenterConfig.json file doesn't require the schema validation
      if (fileNameWithoutExtension === 'analyticsCenterConfig') return true;

      // Checking if schema is defined for the config file
      if (!configSchema[fileNameWithoutExtension]) return message.createNewApp.unknownConfig;

      // validating the config file schema using the AJV package
      const ajv = new Ajv({ allErrors: false }); // Change to true to return all the errors
      const valid = ajv.validate(configSchema[fileNameWithoutExtension], configJson);
      if (!valid) return ajv.errorsText();

      return true;
    }).catch(error => `${message.createNewApp.errorReadingConfig}: ${error.message}`);
  },
};
