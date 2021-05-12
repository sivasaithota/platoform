const config = require('config');
const constants = require('../../common/constants');
const JobSubmitter = require('../common/jobSubmitter');
const deploymentDataService = require('../../dataServices').deployment;
const TableauManager = require('../report/tableauManager');
const UniqueId = require('../../common/uniqueIdGenerator');
const socketHandler = require('../../socket');
const logger = require('../../common/logger');
const filer = require('../../common/filer');

class DeployManager {
  constructor() {
    socketHandler.registerEvent('updateJobStatus', this._updateJobStatus.bind(this));
  }

  async deploy(appJobObject) {
    const version = this.getVersion(appJobObject);
    const jobData = {
      appId: appJobObject.appId,
      jobId: new UniqueId().getTimeBasedId(),
      jobType: constants.string.deployment.type.deploy,
      deployType: appJobObject.deployType,
      stage: constants.string.deployment.stages.deployment,
      name: appJobObject.name,
      appType: appJobObject.type,
      url: appJobObject.url,
      version,
    };
    logger.debug(`Publishing deployment job to rabbitmq for the appId:${jobData.appId}`, jobData.jobId);
    await new JobSubmitter().submitJob(jobData);
    logger.debug(`Successfully published deployment job to rabbitmq for the appId:${jobData.appId}`);
    this.establishSocketConnection(jobData);
    return this._getDeploymentResponseObject(appJobObject, jobData);
  }

  establishSocketConnection(jobObject) {
    logger.debug(`Establishing socket connection for the app:${jobObject.appId}`, jobObject.jobId);
    socketHandler.joinRoom(jobObject.jobId);
    socketHandler.joinRoom(`${jobObject.jobId}_client`);
  }

  async _updateJobStatus(jobData) {
    logger.debug('updating job status..', jobData);

    let status = null;
    if (constants.string.deployment.status.success.includes(jobData.result)) {
      if (jobData.deployType === constants.string.deployment.type.restore) {
        jobData.stage = constants.string.deployment.stages.publishReports;
        try {
          await this._publishReports(jobData.appId);
        } catch (err) {
          logger.error('Error while publishing reports', err);
          [jobData.result] = constants.string.deployment.status.failure;
        }
      }
      status = jobData.jobType === constants.string.deployment.type.stop ? constants.string.application.status.inactive
        : constants.string.application.status.active;
    } else if (constants.string.deployment.status.failure.includes(jobData.result)) {
      [status] = constants.string.deployment.status.failure;
    } else if (jobData.deployType === constants.string.deployment.type.upgrade) {
      status = constants.string.application.status.upgrading;
    } else {
      status = constants.string.application.status.activating;
    }

    socketHandler.emitEvent(`${jobData.jobId}_client`, 'updateDeploymentStatus', {
      result: jobData.result || status,
      stage: jobData.stage,
    });
    if (jobData.result) {
      socketHandler.leaveRoom(jobData.jobId);
      socketHandler.leaveRoom(`${jobData.jobId}_client`);
    }

    const updateObject = {
      status,
      version: jobData.version,
      'deployment.result': jobData.result,
    };
    await deploymentDataService.updateDeployStatus(jobData.appId, updateObject);
  }

  async _publishReports(appId) {
    const reportsPath = `${constants.fs.paths.appRoot}/${appId}/${constants.appFolderMap.reports}`;
    if (!await filer.pathExists(reportsPath)) return;

    const reports = JSON.parse(await filer.readFile(`${reportsPath}/config.json`));
    const tableauManager = new TableauManager(appId);
    const publishedSet = new Set();

    await Promise.all(
      reports.tableau.map(async (report) => {
        // If workbook has not been published, publish it and store the result
        if (publishedSet.has(report.workbook)) return;
        publishedSet.add(report.workbook);
        const { contentUrl } = (await tableauManager.publishWorkbook(`${reportsPath}/${report.workbook}.twbx`)).data.workbook;
        report.url = report.url.replace(/\/views\/\w\//, `/views/${contentUrl}`);
      }),
    );
    await filer.writeFile(`${reportsPath}/config.json`, JSON.stringify(reports, null, 4));
    await filer.deleteDirectory(reportsPath);
  }

  _getDeploymentResponseObject(appJobObject, jobData) {
    return {
      status: constants.string.deployment.queued,
      deployment: {
        deployedBy: appJobObject.username,
        deployedAt: new Date(),
        jobId: jobData.jobId,
        roomId: `${jobData.jobId}_client`,
      },
    };
  }

  getVersion(deployObject) {
    if (deployObject.deployType === constants.string.deployment.type.restart) {
      return deployObject.version || config.versions.analyticsCenterVersion;
    }

    return deployObject.type === constants.string.application.type.acApp ? config.versions.analyticsCenterVersion
      : config.versions.featuredAppVersion;
  }
}

module.exports = new DeployManager();
