const jobprocessor = require('config').get('jobprocessor');

const environmentManager = require('./manager');
const dataServices = require('../../dataServices');
const RequestHelper = require('../../common/requestHelper');
const UniqueId = require('../../common/uniqueIdGenerator');
const logger = require('../../common/logger');
const constants = require('../../common/constants');

class Environment {
  async getEnvironments({ type }, { internalName }) {
    logger.debug('Executing query to get list of environment');
    try {
      const { all } = constants.types.environment;
      const query = (internalName && { type, internalName }) || ((type !== all) ? { type } : null);
      const result = await dataServices.environment.getEnvironments(query);
      logger.debug('Retrieved result from the database', result);
      return result;
    } catch (err) {
      logger.error('Error while getting list of environment', err);
      throw err;
    }
  }

  async createEnvironment(data, user) {
    try {
      const { environment: { baseDockerRegistry, localDockerRegistry } } = await dataServices.global.getSetting();
      logger.debug('Submit job for installing packages');
      const jobData = {
        jobId: new UniqueId().getTimeBasedId(),
        jobType: constants.string.environment.type.create,
        description: data.description,
        baseImage: data.baseImage,
        baseRegistry: `${baseDockerRegistry}/`,
        name: data.name,
        commands: data.commands,
        registry: `${localDockerRegistry}/`,
        createdBy: user.username,
        updatedBy: user.username,
        locked: data.locked,
        type: constants.types.environment.custom,
      };
      await environmentManager.submitJob(jobData);
      return {
        ...jobData,
        stats: constants.string.environment.status.queued,
        roomId: `${jobData.jobId}_client`,
      };
    } catch (err) {
      logger.error('Error encountered while creating environment', err);
      throw err;
    }
  }

  async updateEnvironment(data, user, paramsObject) {
    try {
      logger.debug('Submit job for updating environment', data);
      const jobData = {
        objectId: paramsObject.id,
        jobId: new UniqueId().getTimeBasedId(),
        jobType: constants.string.environment.type.update,
        description: data.description,
        baseImage: data.name,
        name: data.name,
        commands: data.commands,
        registry: data.registry,
        updatedBy: user.username,
        locked: data.locked,
      };
      await environmentManager.submitJob(jobData);
      return {
        ...jobData,
        stats: constants.string.environment.status.queued,
        roomId: `${jobData.jobId}_client`,
      };
    } catch (err) {
      logger.error('Error encountered while updating environment', err);
      throw err;
    }
  }

  async deleteEnvironment(token, paramsObject) {
    try {
      logger.info('Deleting environment via jobProcessor');
      const url = `${jobprocessor.server}${jobprocessor.path}/executions/environment`;
      const { name, registry } = (await dataServices.environment.getEnvironmentById(paramsObject.id, { name: 1, registry: 1 }));
      const data = {
        imageName: name,
        imageRegistry: registry,
      };
      await new RequestHelper('', { Authorization: `${token}` }).url(url).delete.data(data).makeRequest();
      const result = await dataServices.environment.deleteEnvironment(paramsObject.id);
      return { result: result.result.n > 0 };
    } catch (err) {
      logger.error('Error encountered while deleting environment:', err);
      throw err;
    }
  }
}

module.exports = new Environment();
