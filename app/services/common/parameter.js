
const parameterDataService = require('../../dataServices').parameter;
const constants = require('../../common/constants');
const logger = require('../../common/logger');

class Parameter {
  async checkIfParameterGroupExistsById(paramsObject) {
    logger.info('Checking if parameter group exists by Id');
    const result = await parameterDataService.getParameterGroupDataById(paramsObject.parameterGroupId, ['_id']);
    const parameterGroupExists = result && result._id.toString() === paramsObject.parameterGroupId;
    logger.info(parameterGroupExists ? 'Parameter group exists' : 'Parameter group does not exist');
    return parameterGroupExists;
  }

  async checkIfParameterGroupExistsByName(idObject, parameterGroupName) {
    logger.info('Checking if parameter group exists by name');
    const result = await parameterDataService.getParameterGroupAppIdByName(idObject.appId, parameterGroupName);
    const parameterGroupExists = result && result._id.toString() !== idObject.parameterGroupId;
    logger.info(parameterGroupExists ? 'Parameter group exists' : 'Parameter group does not exist');
    return parameterGroupExists;
  }

  async checkIfParameterGroupNotDefault(paramsObject) {
    logger.info('Checking if parameter group is not default');
    const result = await parameterDataService.getParameterGroupDataById(paramsObject.parameterGroupId, ['name']);
    const parameterGroupNotDefault = result && result.name !== constants.defaultProperties.defaultGroup.name;
    logger.info(parameterGroupNotDefault ? 'Parameter group is not Default' : 'Parameter group is Default');
    return parameterGroupNotDefault;
  }

  async checkIfParameterExistsById(paramsObject) {
    logger.info('Checking if parameter exists by name');
    const result = await parameterDataService.getParameterIdByAppId(paramsObject);
    const parameterExists = result && result._id.toString() === paramsObject.parameterId;
    logger.info(parameterExists ? 'Parameter exists' : 'Parameter does not exist');
    return parameterExists;
  }

  async checkIfParameterExistsByName(paramsObject, parameterName) {
    logger.info('Checking if parameter exists by name');
    const result = await parameterDataService.getParameterAppIdByNameAndGroupId(paramsObject, parameterName);
    const parameterExists = result && result._id.toString() !== paramsObject.parameterId;
    logger.info(parameterExists ? 'Parameter exists' : 'Parameter does not exist');
    return parameterExists;
  }

  async getParameterData(parameterId, ...parameterProperties) {
    logger.debug('Fetching parameter data', parameterProperties);
    return parameterDataService.getParameterData(parameterId, parameterProperties);
  }

  async createDefaultParameterGroup(appId) {
    logger.debug('Creating default parameter group');
    const result = await parameterDataService.createParameterGroup(appId, constants.defaultProperties.defaultGroup);
    logger.info('Created default parameter group', result.insertedId);
  }

  async replaceAllParameterGroupsInApplication(appId, parameterGroups) {
    logger.info('Replacing parameter groups for application', appId);
    const result = await parameterDataService.replaceParameterGroups(appId, parameterGroups);
    logger.debug('Parameter groups replaced successfully');
    return result.insertedIds;
  }

  async createParameters(appId, parameters) {
    const result = await parameterDataService.createParameters(appId, parameters);
    return result.insertedIds;
  }

  async checkIfParametersUnique(paramsObject, parameters) {
    try {
      // Get names of parameters not already in the target parameter group
      const paramsIds = [].concat(...Object.values({ ...parameters, [paramsObject.parameterGroupId]: null }));
      logger.info('Getting parameters names by parameters ids');
      const parameterNames = await parameterDataService.getParametersNamesById(paramsIds);
      const namesArray = parameterNames.map(param => param.name); // getting array of names
      logger.info('Getting parameters ids by parameters names');
      const result = await parameterDataService.getParametersIdsByNames(namesArray, paramsObject.parameterGroupId);
      return !!result.length; // checking if result array includes at least 1 element
    } catch (e) {
      logger.error('checkIfParametersUnique error', e);
      return true;
    }
  }
}

module.exports = new Parameter();
