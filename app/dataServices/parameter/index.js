const mongoClient = require('../mongoClient');
const constants = require('../../common/constants');
const dataServiceConstants = require('./constants');

class Parameter {
  async getParameters(appId) {
    const aggregationPipleline = dataServiceConstants.getParametersAggregatePipeline(mongoClient.getObjectId(appId));
    return mongoClient.aggregate(
      constants.collection.names.parameterGroup,
      aggregationPipleline,
    );
  }

  async getParameterGroupDataById(parameterGroupId, parameterGroupProperties) {
    const query = {
      _id: mongoClient.getObjectId(parameterGroupId),
    };
    const projection = parameterGroupProperties.reduce((obj, property) => Object.assign(obj, { [property]: 1 }), {});

    return mongoClient.findOne(constants.collection.names.parameterGroup, query, projection);
  }

  async getParameterGroupAppIdByName(appId, parameterGroupName) {
    const query = {
      appId: mongoClient.getObjectId(appId),
      name: parameterGroupName,
    };
    const projection = {
      appId: 1,
    };

    return mongoClient.findOne(constants.collection.names.parameterGroup, query, projection);
  }

  async getParameterIdByAppId(idObject) {
    const query = {
      _id: mongoClient.getObjectId(idObject.parameterId),
      appId: mongoClient.getObjectId(idObject.appId),
    };
    const projection = {
      _id: 1,
    };

    return mongoClient.findOne(constants.collection.names.parameter, query, projection);
  }

  async getParameterAppIdByNameAndGroupId(idObject, parameterName) {
    const query = {
      appId: mongoClient.getObjectId(idObject.appId),
      parameterGroupId: mongoClient.getObjectId(idObject.parameterGroupId),
      name: parameterName,
    };
    const projection = {
      appId: 1,
    };

    return mongoClient.findOne(constants.collection.names.parameter, query, projection);
  }

  async getParametersNamesById(paramsIds) {
    const paramObjectIds = paramsIds.map(id => mongoClient.getObjectId(id));
    return mongoClient.find(
      constants.collection.names.parameter,
      { _id: { $in: paramObjectIds } },
      { name: 1 },
    );
  }

  async getParametersIdsByNames(paramsNames, parameterGroupId) {
    const query = {
      name: { $in: paramsNames },
      parameterGroupId: mongoClient.getObjectId(parameterGroupId),
    };
    const projection = { _id: 1 };

    return mongoClient.find(constants.collection.names.parameter, query, projection);
  }

  async getParameterData(parameterId, parameterProperties) {
    const query = {
      _id: mongoClient.getObjectId(parameterId),
    };
    const projection = parameterProperties.reduce((obj, property) => Object.assign(obj, { [property]: 1 }), {});

    return mongoClient.findOne(constants.collection.names.parameter, query, projection);
  }

  async createParameters(appId, parameters) {
    const appObjectId = mongoClient.getObjectId(appId);
    parameters.forEach(parameter => Object.assign(parameter, { appId: appObjectId }));
    return mongoClient.insertMany(constants.collection.names.parameter, parameters);
  }

  async replaceParameterGroups(appId, parameterGroups) {
    const appObjectId = mongoClient.getObjectId(appId);
    // Combine all the parameters in the new parameter groups, and delete all old parameters which would not be part of the list
    await mongoClient.deleteMany(constants.collection.names.parameter, {
      appId: appObjectId,
      _id: { $nin: [].concat(...parameterGroups.map(group => group.refParameters)) },
    });
    // Assign appId and position values to parameter groups, and insert them into the database
    parameterGroups.forEach((group, index) => Object.assign(group, { appId: appObjectId, position: index + 1 }));
    const { insertedIds } = await mongoClient.insertMany(constants.collection.names.parameterGroup, parameterGroups);
    // Replace all the old parameter groups, excluding the old default group if the new parameter groups do not contain a default group
    const defaultGroupExists = parameterGroups.some(group => group.name === constants.defaultProperties.defaultGroup.name);
    return mongoClient.deleteMany(constants.collection.names.parameterGroup, {
      appId: appObjectId,
      _id: { $nin: Object.values(insertedIds) },
      ...(!defaultGroupExists ? { name: { $ne: constants.defaultProperties.defaultGroup.name } } : {}),
    });
  }

  async createParameterGroup(appId, parameterGroupObject) {
    const appObjectId = mongoClient.getObjectId(appId);
    const document = {
      name: parameterGroupObject.name,
      appId: appObjectId,
      isCollapsed: parameterGroupObject.isCollapsed,
      refParameters: [],
      createdBy: parameterGroupObject.username,
      createdAt: parameterGroupObject.createdAt,
      updatedBy: parameterGroupObject.username,
      updatedAt: parameterGroupObject.createdAt,
    };

    const position = await mongoClient.countDocuments(constants.collection.names.parameterGroup, { appId: appObjectId });
    return mongoClient.insertOne(constants.collection.names.parameterGroup, { ...document, position });
  }

  async updateParameterGroup(idObject, parameterGroupObject) {
    const query = {
      _id: mongoClient.getObjectId(idObject.parameterGroupId),
    };
    const update = {
      $set: parameterGroupObject,
    };

    return mongoClient.updateOne(constants.collection.names.parameterGroup, query, update);
  }

  async deleteParameterGroup(idObject, movedToGroupId) {
    const parameterGroupObjectId = mongoClient.getObjectId(idObject.parameterGroupId);

    const deletedGroup = (await mongoClient.findOneAndDelete(
      constants.collection.names.parameterGroup,
      { _id: parameterGroupObjectId },
    )).value;
    const updateQuery = {
      appId: mongoClient.getObjectId(idObject.appId),
      position: { $gt: deletedGroup.position },
    };
    await mongoClient.updateMany(constants.collection.names.parameterGroup, updateQuery, { $inc: { position: -1 } });

    if (!movedToGroupId) {
      return mongoClient.deleteMany(constants.collection.names.parameter, { parameterGroupId: parameterGroupObjectId });
    }

    const movedToGroupObjectId = mongoClient.getObjectId(movedToGroupId);

    await mongoClient.updateOne(
      constants.collection.names.parameterGroup,
      { _id: movedToGroupObjectId },
      { $push: { refParameters: { $each: deletedGroup.refParameters } } },
    );
    return mongoClient.updateMany(
      constants.collection.names.parameter,
      { _id: { $in: deletedGroup.refParameters } },
      { $set: { parameterGroupId: movedToGroupObjectId } },
    );
  }

  async moveParameterGroup(idObject, newPosition) {
    const parameterGroupObjectId = mongoClient.getObjectId(idObject.parameterGroupId);
    const movedGroup = (await mongoClient.findOneAndUpdate(
      constants.collection.names.parameterGroup,
      { _id: parameterGroupObjectId },
      { $set: { position: newPosition } },
      { position: 1 },
    )).value;
    const { position } = movedGroup;

    if (position === newPosition) return;
    return mongoClient.updateMany(
      constants.collection.names.parameterGroup,
      {
        _id: { $nin: [parameterGroupObjectId] },
        appId: mongoClient.getObjectId(idObject.appId),
        position: newPosition < position ? { $lt: position, $gte: newPosition } : { $gt: position, $lte: newPosition },
      },
      { $inc: { position: newPosition < position ? 1 : -1 } },
    );
  }

  async createParameter(idObject, parameterObject, position) {
    const document = {
      appId: mongoClient.getObjectId(idObject.appId),
      parameterGroupId: mongoClient.getObjectId(idObject.parameterGroupId),
      name: parameterObject.name,
      type: parameterObject.type,
      ...parameterObject.specificProperties,
      isRequired: parameterObject.isRequired,
      tooltip: parameterObject.tooltip,
      createdBy: parameterObject.username,
      createdAt: parameterObject.createdAt,
      updatedBy: parameterObject.username,
      updatedAt: parameterObject.createdAt,
    };

    // Create parameter and store the result containing its Id
    const result = await mongoClient.insertOne(constants.collection.names.parameter, document);

    // Add reference to parameter Id in parameter group in which it is created
    mongoClient.updateOne(
      constants.collection.names.parameterGroup,
      { _id: mongoClient.getObjectId(idObject.parameterGroupId) },
      {
        $push: {
          refParameters: {
            ...{ $each: [result.insertedId] },
            ...(position ? { $position: position } : {}),
          },
        },
      },
    );

    return result;
  }

  async updateParameter(idObject, parameterObject) {
    const query = {
      _id: mongoClient.getObjectId(idObject.parameterId),
    };
    const update = {
      $set: parameterObject,
    };

    return mongoClient.updateOne(constants.collection.names.parameter, query, update);
  }

  async deleteParameters(parameterMap) {
    const parameterGroupIds = Object.keys(parameterMap).map(groupId => mongoClient.getObjectId(groupId));
    const parameterIds = Object.values(parameterMap).reduce((merged, ids) => merged.concat(ids.map(id => mongoClient.getObjectId(id))), []);

    // Removing references to the parameters to be deleted from their parameter groups
    await mongoClient.updateMany(
      constants.collection.names.parameterGroup,
      { _id: { $in: parameterGroupIds } },
      { $pull: { refParameters: { $in: parameterIds } } },
    );
    // Deleting the parameters themselves
    return mongoClient.deleteMany(
      constants.collection.names.parameter,
      { _id: { $in: parameterIds } },
    );
  }

  async moveParameters(idObject, { parameterMap, position }) {
    const fromParameterGroupIds = Object.keys(parameterMap).map(groupId => mongoClient.getObjectId(groupId));
    const parameterIds = Object.values(parameterMap).reduce((merged, ids) => merged.concat(ids.map(id => mongoClient.getObjectId(id))), []);
    const toParameterGroupId = mongoClient.getObjectId(idObject.parameterGroupId);

    // Updating the parameter group Id for the parameters to be moved
    await mongoClient.updateMany(
      constants.collection.names.parameter,
      { _id: { $in: parameterIds } },
      { $set: { parameterGroupId: toParameterGroupId } },
    );
    // Removing references to the parameters to be moved from their original parameter groups
    await mongoClient.updateMany(
      constants.collection.names.parameterGroup,
      { _id: { $in: fromParameterGroupIds } },
      { $pull: { refParameters: { $in: parameterIds } } },
    );
    // Adding references to the parameters to be moved to their destination parameter group
    return mongoClient.updateOne(
      constants.collection.names.parameterGroup,
      { _id: mongoClient.getObjectId(idObject.parameterGroupId) },
      {
        $push: {
          refParameters: {
            $each: parameterIds,
            $position: position,
          },
        },
      },
    );
  }
}

module.exports = new Parameter();
