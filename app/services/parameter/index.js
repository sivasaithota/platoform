const parameterDataService = require('../../dataServices').parameter;
const commonServices = require('../../services/common');
const logger = require('../../common/logger');

class Parameter {
  async getParameters(paramsObject) {
    logger.debug('Getting list of parameters from database');

    try {
      const result = await parameterDataService.getParameters(paramsObject.appId);
      logger.debug('Successfully fetched parameters');
      return result;
    } catch (err) {
      logger.error('Error while getting parameters', err);
      throw err;
    }
  }

  async createParameterGroup(paramsObject, parameterObject, userObject) {
    parameterObject.username = userObject.username;
    parameterObject.createdAt = new Date();

    logger.debug('Inserting the parameter group in database');

    try {
      const result = await parameterDataService.createParameterGroup(paramsObject.appId, parameterObject);
      logger.debug('Successfully created parameter group');
      return {
        id: result.insertedId,
      };
    } catch (err) {
      logger.error('Error while creating parameter group', err);
      throw err;
    }
  }

  async updateParameterGroup(paramsObject, parameterGroupObject, userObject) {
    parameterGroupObject.updatedBy = userObject.username;
    parameterGroupObject.updatedAt = new Date();

    logger.debug('Updating the parameter group in database');

    try {
      const result = await parameterDataService.updateParameterGroup(paramsObject, parameterGroupObject);
      logger.debug('Successfully updated parameter group');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while updating parameter group', err);
      throw err;
    }
  }

  async deleteParameterGroup(paramsObject, queryObject) {
    logger.debug('Deleting the parameter group from database');

    try {
      const result = await parameterDataService.deleteParameterGroup(paramsObject, queryObject.parametersMovedToGroupId);
      logger.debug('Successfully deleted parameter group');
      return {
        ok: (result.result.nModified || result.result.n) > 0,
      };
    } catch (err) {
      logger.error('Error while deleting parameter group', err);
      throw err;
    }
  }

  async moveParameterGroup(paramsObject, moveObject) {
    logger.debug('Moving the parameter group in database');

    try {
      const result = await parameterDataService.moveParameterGroup(paramsObject, moveObject.position);
      logger.debug('Successfully moved parameter group');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while moving parameter group', err);
      throw err;
    }
  }

  async createParameter(paramsObject, parameterObject, userObject, position) {
    parameterObject.username = userObject.username;
    parameterObject.createdAt = new Date();
    position = parseInt(position, 10);

    logger.debug('Inserting the parameter in database');

    try {
      const typeProperties = (await commonServices.global.getParameterType(parameterObject.type)).properties;
      parameterObject.specificProperties = typeProperties.reduce((obj, prop) => ({ ...obj, [prop.name]: parameterObject[prop.name] }), {});
      const result = await parameterDataService.createParameter(paramsObject, parameterObject, position);
      logger.debug('Successfully created parameter');
      return {
        id: result.insertedId,
      };
    } catch (err) {
      logger.error('Error while creating parameter', err);
      throw err;
    }
  }

  async updateParameter(paramsObject, parameterObject, userObject) {
    parameterObject.updatedBy = userObject.username;
    parameterObject.updatedAt = new Date();

    logger.debug('Updating the parameter in database');

    try {
      const result = await parameterDataService.updateParameter(paramsObject, parameterObject);
      logger.debug('Successfully updated parameter');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while updating parameter', err);
      throw err;
    }
  }

  async deleteParameters(deleteParametersObject) {
    logger.debug('Deleting the parameters from database');

    try {
      const result = await parameterDataService.deleteParameters(deleteParametersObject.parameterMap);
      logger.debug('Successfully deleted parameters');
      return {
        ok: result.result.n > 0,
      };
    } catch (err) {
      logger.error('Error while deleting parameters', err);
      throw err;
    }
  }

  async moveParameters(paramsObject, moveParametersObject) {
    logger.debug('Moving the parameters in database');

    try {
      const result = await parameterDataService.moveParameters(paramsObject, moveParametersObject);
      logger.debug('Successfully moved parameters');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while moving parameters', err);
      throw err;
    }
  }
}

module.exports = new Parameter();
