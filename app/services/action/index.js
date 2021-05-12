const logger = require('../../common/logger');
const helper = require('../../common/helper');
const actionDataService = require('../../dataServices').action;


class Action {
  async getActions(paramsObject) {
    logger.debug('Executing query to get the list of actions.');
    try {
      const result = await actionDataService.getActions(paramsObject.appId);
      logger.debug('Retrieved result from the database');
      return result;
    } catch (err) {
      logger.error('Error while getting actions list', err);
      throw err;
    }
  }

  async createAction(paramsObject, actionObject, userObject) {
    logger.debug('Inserting the action in database');
    try {
      actionObject = {
        appId: paramsObject.appId,
        ...actionObject,
        ...helper.getAuditProperties(userObject.username),
      };
      const result = await actionDataService.createAction(actionObject);
      logger.debug('Successfully created app');
      return {
        id: result.insertedId,
      };
    } catch (err) {
      logger.error('Error while creating action', err);
      throw err;
    }
  }

  async updateAction(paramsObject, actionObject, userObject) {
    logger.debug('Updating the action in database', paramsObject.actionId);
    try {
      actionObject = {
        ...actionObject,
        ...helper.getAuditProperties(userObject.username, true),
      };
      const result = await actionDataService.updateAction(paramsObject, actionObject);
      logger.debug('Successfully updated action');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while updating action', err);
      throw err;
    }
  }

  async deleteAction(paramsObject) {
    logger.debug('Deleting action from database');

    try {
      const deletedAction = await actionDataService.deleteAction(paramsObject);
      logger.debug('Successfully deleted action');
      return {
        ok: !!deletedAction,
      };
    } catch (err) {
      logger.error('Error while deleting action', err);
      throw err;
    }
  }

  async moveAction(paramsObject, moveObject) {
    logger.debug('Moving action from database');

    try {
      const result = await actionDataService.moveAction(paramsObject, moveObject.position);
      logger.debug('Successfully moved action');
      return {
        ok: !!result && result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while moving action', err);
      throw err;
    }
  }

  async getTriggers(paramsObject) {
    logger.debug('Executing query to get the list of triggers.');
    try {
      const result = await actionDataService.getTriggers(paramsObject.appId);
      logger.debug('Retrieved result from the database');
      return result;
    } catch (err) {
      logger.error('Error while getting triggers list', err);
      throw err;
    }
  }

  async setTrigger(paramsObject, triggerObject, userObject) {
    triggerObject = {
      ...triggerObject,
      ...helper.getAuditProperties(userObject.username, true),
    };
    logger.debug('Setting the trigger in database');

    try {
      const result = await actionDataService.setTrigger(paramsObject.appId, triggerObject);
      logger.debug('Successfully set trigger');
      return {
        ok: result.result.nModified > 0 || result.result.upserted.length,
        id: result.result.upserted && result.result.upserted.length && result.result.upserted[0]._id,
      };
    } catch (err) {
      logger.error('Error while setting trigger', err);
      throw err;
    }
  }
}

module.exports = new Action();
