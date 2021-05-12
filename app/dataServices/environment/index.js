const mongoClient = require('../mongoClient');
const constants = require('../../common/constants');

class Environment {
  createEnvironment(environmentObject) {
    const environment = {
      name: environmentObject.name,
      description: environmentObject.description,
      baseImage: environmentObject.baseImage,
      commands: environmentObject.commands,
      registry: environmentObject.registry,
      locked: environmentObject.locked,
      type: environmentObject.type,
      createdBy: environmentObject.createdBy,
      createdAt: environmentObject.startTime,
      updatedBy: environmentObject.updatedBy,
      updatedAt: environmentObject.endTime,
    };
    return mongoClient.insertOne(constants.collection.names.environment, environment);
  }

  async updateEnvironment(jobData) {
    const query = {
      _id: mongoClient.getObjectId(jobData.objectId),
    };
    const pushCommands = {
      commands: {
        $each: jobData.commands,
      },
    };
    const environmentData = {
      description: jobData.description,
      locked: jobData.locked,
      updatedBy: jobData.updatedBy,
      updatedAt: jobData.endTime,
    };
    return mongoClient.updateOne(constants.collection.names.environment, query, {
      $push: pushCommands,
      $set: environmentData,
    });
  }

  getEnvironments(query, projection = {}) {
    query = query || { type: { $ne: constants.types.environment.internal } };
    return mongoClient.find(constants.collection.names.environment, query, projection);
  }

  getEnvironmentById(id, projection = {}) {
    const query = {
      _id: mongoClient.getObjectId(id),
    };
    return mongoClient.findOne(constants.collection.names.environment, query, projection);
  }

  async getEnvironmentByName(name) {
    const environments = await this.getEnvironments();
    let environment = environments.filter(env => env.name === name)[0];
    if (!environment.baseImage)
      return environment;
    const baseEnvironment = environments.find(env => env.name === environment.baseImage);
    return Object.assign(environment, {command: baseEnvironment.command, options: baseEnvironment.options})
  }

  deleteEnvironment(id) {
    const query = {
      _id: mongoClient.getObjectId(id),
    };
    return mongoClient.deleteOne(constants.collection.names.environment, query);
  }
}

module.exports = new Environment();
