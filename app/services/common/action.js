const actionDataService = require('../../dataServices').action;
const logger = require('../../common/logger');

class Action {
  getActionData(actionId, ...actionProperties) {
    logger.debug('Getting action details by id', actionId);
    return actionDataService.getActionData(actionId, actionProperties);
  }

  async checkIfActionExistsById(appId, actionId) {
    logger.info('Checking if action exists by Id', actionId);
    const actionExists = !!await actionDataService.getActionIdByProperty(appId, '_id', actionId);
    logger.info(actionExists ? 'Action exists' : 'Action does not exist');
    return actionExists;
  }

  async checkIfActionExistsByName(appId, actionName) {
    logger.info('Checking if action exists by name', actionName);
    const actionExists = !!await actionDataService.getActionIdByProperty(appId, 'name', actionName);
    logger.info(actionExists ? 'Action exists' : 'Action does not exist');
    return actionExists;
  }

  async checkIfActionExistsByType(appId, actionType) {
    logger.info('Checking if action exists by type', actionType);
    const actionExists = !!await actionDataService.getActionIdByProperty(appId, 'type', actionType);
    logger.info(actionExists ? 'Action exists' : 'Action does not exist');
    return actionExists;
  }

  async checkIfActionExistsByScriptName(appId, fileName) {
    logger.info('Checking if action exists by script name', fileName);
    const actionExists = !!await actionDataService.getActionIdByProperty(appId, 'fileName', fileName);
    logger.info(actionExists ? 'Action exists' : 'Action does not exist');
    return actionExists;
  }

  async replaceAllActionData(appId, actions) {
    logger.info('Replacing all action data in application', appId);
    const result = await actionDataService.replaceActions(appId, actions);
    logger.debug('Actions replaced successfully');
    return result;
  }
}

module.exports = new Action();
