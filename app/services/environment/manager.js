const rabbitMQConfig = require('config').get('rabbitmq.aditionalQueues');
const constants = require('../../common/constants');
const JobSubmitter = require('../common/jobSubmitter');
const environmentDataService = require('../../dataServices').environment;
const socketHandler = require('../../socket');
const logger = require('../../common/logger');

class EnvironmentManager {
  constructor() {
    socketHandler.registerEvent('updatedDockerJobStatus', this._updateJobStatus.bind(this));
  }

  async submitJob(jobData) {
    logger.info('Successfully published package installation job to rabbitmq for creating environment', jobData);
    this._establishSocketConnection(jobData);
    await new JobSubmitter(rabbitMQConfig.docker).submitJob(jobData);
  }

  _establishSocketConnection(jobObject) {
    logger.info('Establishing socket connection for docker installation:', jobObject.jobId);
    socketHandler.joinRoom(jobObject.jobId);
    socketHandler.joinRoom(`${jobObject.jobId}_client`);
  }

  async _updateJobStatus(jobData) {
    logger.debug('updating job status..', jobData);
    let _id;
    if (jobData.status === constants.string.environment.status.success) {
      if (jobData.jobType === constants.string.environment.type.create) {
        const result = await environmentDataService.createEnvironment(jobData);
        _id = result.insertedId.toString();
      } else {
        await environmentDataService.updateEnvironment(jobData);
      }
    }
    logger.info('updating job status to client..', jobData);
    if ([constants.string.environment.status.success, constants.string.environment.status.failure].includes(jobData.status)) {
      await new Promise(resolve => setTimeout(() => resolve(1), 5000));
      socketHandler.emitEvent(`${jobData.jobId}_client`, 'updatedDockerStatus', {
        ...jobData,
        data: 'End of the task',
      });
      socketHandler.leaveRoom(jobData.jobId);
      socketHandler.leaveRoom(`${jobData.jobId}_client`);
    } else {
      socketHandler.emitEvent(`${jobData.jobId}_client`, 'updatedDockerStatus', {
        ...jobData,
        _id,
      });
    }
  }
}

module.exports = new EnvironmentManager();
