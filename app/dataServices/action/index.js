const workflowConfig = require('config').get('workflow');
const constants = require('../../common/constants');
const mongoClient = require('../../dataServices/mongoClient');
const RequestHelper = require('../../common/requestHelper');

class Action {
  getActionIdByProperty(appId, property, value) {
    appId = mongoClient.getObjectId(appId);
    if (property === '_id') value = mongoClient.getObjectId(value);
    return mongoClient.findOne(
      constants.collection.names.action,
      { appId, [property]: value },
      { _id: 1 },
    );
  }

  async replaceActions(appId, actions) {
    const appObjectId = mongoClient.getObjectId(appId);
    constants.types.table.forEach((type) => {
      actions.filter(action => action.segment === type).forEach((action, index) => {
        action.appId = appObjectId;
        action.segmentPosition = index;
      });
    });
    const deletedActions = await mongoClient.find(
      constants.collection.names.action,
      { appId: appObjectId, type: constants.types.action.secondary },
    );
    await mongoClient.insertMany(constants.collection.names.action, actions);
    await mongoClient.deleteMany(
      constants.collection.names.action,
      { _id: { $in: deletedActions.map(action => action._id) } },
    );
    return { deletedActions };
  }

  getActionData(parameterId, actionProperties) {
    const projection = actionProperties.reduce((obj, property) => Object.assign(obj, { [property]: 1 }), { _id: 0 });

    return mongoClient.findOne(
      constants.collection.names.action,
      { _id: mongoClient.getObjectId(parameterId) },
      projection,
    );
  }

  getActions(appId) {
    const projection = {
      _id: 1,
      type: 1,
      segment: 1,
      name: 1,
      description: 1,
      fileName: 1,
      environment: 1,
      instanceType: 1,
      downloadFile: 1,
      isScenarioSpecific: 1,
      lastAccessedAt: 1,
      lastAccessedBy: 1,
    };

    return mongoClient.find(
      constants.collection.names.action,
      { appId: mongoClient.getObjectId(appId) },
      projection,
      { segment: 1, segmentPosition: 1 },
    );
  }

  async createAction(actionObject) {
    actionObject.appId = mongoClient.getObjectId(actionObject.appId);
    if (actionObject.segment) {
      actionObject.segmentPosition = await mongoClient.countDocuments(
        constants.collection.names.action,
        { appId: actionObject.appId, segment: actionObject.segment },
      );
    }

    return mongoClient.insertOne(constants.collection.names.action, actionObject);
  }

  updateAction(paramsObject, actionObject) {
    return mongoClient.updateOne(
      constants.collection.names.action,
      { _id: mongoClient.getObjectId(paramsObject.actionId) },
      { $set: actionObject },
    );
  }

  async deleteAction(idObject) {
    const { name, segment, segmentPosition } = (await mongoClient.findOneAndDelete(
      constants.collection.names.action,
      { _id: mongoClient.getObjectId(idObject.actionId) },
    )).value;

    const updateQuery = {
      appId: mongoClient.getObjectId(idObject.appId),
      segment,
      segmentPosition: { $gt: segmentPosition },
    };
    await mongoClient.updateMany(constants.collection.names.action, updateQuery, { $inc: { segmentPosition: -1 } });
    const params = {
      app_id: idObject.appId,
      action_id: idObject.actionId,
    };
    await new RequestHelper().url(`${workflowConfig.apiBaseUrl}/drop/action`).params(params).delete.makeRequest();
    return { name, segment };
  }

  async moveAction(idObject, newPosition) {
    const actionObjectId = mongoClient.getObjectId(idObject.actionId);
    // Update the actions's segmentPosition, and get the old segmentPosition value
    const oldPosition = (await mongoClient.findOneAndUpdate(
      constants.collection.names.action,
      { _id: actionObjectId },
      { $set: { segmentPosition: newPosition } },
      { segmentPosition: 1 },
    )).value.segmentPosition;
    // If old and new segmentPositions are same, then action is not moved
    if (oldPosition === newPosition) return;
    // Shift the segmentPosition of the other actions if they fall between the moved action's old and new segmentPositions
    return mongoClient.updateMany(
      constants.collection.names.action,
      {
        _id: { $nin: [actionObjectId] },
        appId: mongoClient.getObjectId(idObject.appId),
        segmentPosition: newPosition < oldPosition ? { $lt: oldPosition, $gte: newPosition } : { $gt: oldPosition, $lte: newPosition },
      },
      { $inc: { segmentPosition: newPosition < oldPosition ? 1 : -1 } },
    );
  }

  getTriggers(appId) {
    const projection = {
      type: 1,
      actionId: 1,
      tableId: 1,
      isEnabled: 1,
      scenarioId: 1,
    };

    return mongoClient.find(
      constants.collection.names.trigger,
      { appId: mongoClient.getObjectId(appId) },
      projection,
    );
  }

  async setTrigger(appId, triggerObject) {
    return mongoClient.updateOne(
      constants.collection.names.trigger,
      { appId: mongoClient.getObjectId(appId), type: triggerObject.type },
      { $set: triggerObject },
      { upsert: true },
    );
  }
}

module.exports = new Action();
