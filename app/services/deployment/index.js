const config = require('../../../config/default.json');
const commonService = require('../common');
const ConfigGenerator = require('./configGenerator');
const logger = require('../../common/logger');
const deployManager = require('./deployManager');
const constants = require('../../common/constants');
const filer = require('../../common/filer');
const RequestHelper = require('../../common/requestHelper');
const socketHandler = require('../../socket');
const environmentDataService = require('../../dataServices').environment;


class Deployment {
  async deploy(paramsObject, deployObject, userObject) {
    try {
      deployObject.appId = paramsObject.appId;
      deployObject.username = userObject.username;

      const appObject = await commonService.application.getApplicationData(deployObject.appId);
      const { appConfig } = await new ConfigGenerator(deployObject.appId, userObject).generate();
      const appFolderPath = `${constants.fs.paths.appRoot}/${deployObject.appId}`;
      await filer.writeFile(`${appFolderPath}/${constants.fs.filenames.applicationConfig}`, JSON.stringify(appConfig, null, 2));

      const jobObject = { ...appObject, ...deployObject };
      return await deployManager.deploy(jobObject);
    } catch (err) {
      logger.error('Error while deploying app', err);
      throw err;
    }
  }

  async deployShiny(paramsObject, folderData, authData) {
    try {
      const appObject = await commonService.application.getApplicationData(paramsObject.appId);
      const shinyUrl = `shiny_${appObject.url}`;
      const { internal } = constants.types.environment;
      const [environmentObject] = await environmentDataService.getEnvironments({
        type: internal,
        internalName: 'shiny',
      });

      if (folderData) {
        const shinyPath = `${constants.fs.paths.appRoot}/${paramsObject.appId}/${constants.fs.directories.app.shiny}`;
        await filer.moveDirectory(folderData.path, shinyPath);
      }

      const jobData = {
        appId: paramsObject.appId,
        url: shinyUrl,
        environmentObject,
      };
      const requestHelper = new RequestHelper(`${config.jobprocessor.server}${config.jobprocessor.path}`, { Authorization: authData });
      socketHandler.registerEvent('updateExecutionStatus', (data) => {
        socketHandler.emitEvent(`${shinyUrl}_client`, 'updateDeploymentStatus', data.result);
        socketHandler.leaveRoom(shinyUrl);
        socketHandler.leaveRoom(`${shinyUrl}_client`);
      });
      socketHandler.joinRoom(shinyUrl);
      socketHandler.joinRoom(`${shinyUrl}_client`);

      await requestHelper.post.url(config.jobprocessor.api.deployShiny).data(jobData).makeRequest();
      return {
        deployment: { roomId: `${shinyUrl}_client` },
        url: shinyUrl,
      };
    } catch (err) {
      logger.error('Error while deploying shiny', err);
      throw err;
    }
  }
}

module.exports = new Deployment();
