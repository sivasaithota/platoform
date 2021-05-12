const path = require('path');
const permission = require('config').get('keycloak.permission');
const applicationDataService = require('../../dataServices').application;
const commonServices = require('../common');
const ApplicationManager = require('./manager');
const ConfigUploader = require('./configUploader');
const ResourceManager = require('./resourceManager');
const constants = require('../../common/constants');
const filer = require('../../common/filer');
const logger = require('../../common/logger');
const helper = require('../../common/helper');
const Packager = require('./packager');

class Application {
  async getApplications(query, user) {
    logger.debug('Executing query to get the list of apps.');
    query.limit = parseInt(query.limit, 10);
    query.skip = parseInt(query.skip, 10);
    query.sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    try {
      const permissions = await new ResourceManager().getPermissionTickets(user.sub);
      const clientScopes = await new ResourceManager().getClientScopes();
      const sharedApps = permissions.map(resp => resp.resource)
        .filter((value, index, self) => self.indexOf(value) === index);
      const applications = await applicationDataService.getApplications(query, user, sharedApps);
      let appScopes = permission.scopes;
      const permissionsObj = permissions.reduce((pObj, p) => {
        const scopes = pObj[p.resource] ? pObj[p.resource] : [];
        scopes.push(clientScopes[p.scope]);
        pObj[p.resource] = scopes;
        return pObj;
      }, {});
      applications.forEach(application => {
        if (!user.isAdmin) appScopes = permissionsObj[application.resourceId];
        application.scopes = appScopes;
      });
      logger.debug('Retrieved result from the database');
      return applications;
    } catch (err) {
      logger.error('Error while getting apps list', err);
      throw err;
    }
  }

  async getApplication(paramsObject) {
    logger.debug('Executing query to get the app details.');
    try {
      const result = await applicationDataService.getApplication(paramsObject.appId);
      logger.debug('Retrieved result from the database');
      return result;
    } catch (err) {
      logger.error('Error while getting app details', err);
      throw err;
    }
  }

  async createApplication(appObject, userObject) {
    let appId;
    Object.assign(appObject, {
      description: '',
      type: constants.string.application.type.acApp,
      status: constants.string.application.status.inProgress,
      username: userObject.username,
      createdAt: new Date(),
    });
    appObject.theme = {
      id: await commonServices.theme.getDefaultThemeId(),
      colorIndex: 0,
    };
    appObject.name = appObject.name.trim();
    logger.info('Inserting the app in database');

    try {
      appId = (await applicationDataService.createApplication(appObject)).insertedId;
      const appManager = new ApplicationManager(appId, appObject.name, userObject.username);
      const resourceManager = new ResourceManager();
      const resourceId = (await resourceManager.createResource(appId))._id;
      const { roleName, dbusername, dbpassword } = appManager.getUserDataForRoles(constants.string.postgresRoles.dba);
      await applicationDataService.updateApplication(appId, {
        url: await appManager.getUrl(),
        resourceId,
        'database.databaseName': appManager.getDatabaseName(),
        'database.username': dbusername,
        'database.password': dbpassword,
        'database.roleName': roleName,
        'database.roles': {
          readWrite: appManager.getUserDataForRoles(constants.string.postgresRoles.readWrite),
          readOnly: appManager.getUserDataForRoles(constants.string.postgresRoles.readOnly),
          adhoc: appManager.getUserDataForRoles(constants.string.postgresRoles.adhoc),
        },
      });
      await resourceManager.shareApp(resourceId, userObject.sub, permission.scopes);
      await commonServices.parameter.createDefaultParameterGroup(appId);
      await appManager.createAppDirectory();
      if (appObject.folderData) await appManager.uploadApplicationData(appObject);
      logger.debug('Successfully created app');
      return {
        id: appId,
      };
    } catch (err) {
      if (appId) await applicationDataService.deleteAllApplicationData(appId);
      logger.error('Error while creating app', err);
      throw err;
    }
  }

  async updateApplication(paramsObject, appObject, userObject) {
    appObject.updatedBy = userObject.username;
    appObject.updatedAt = new Date();
    if (appObject.name) {
      appObject.name = appObject.name.trim();
    }

    if (appObject.segments && Object.values(appObject.segments).some(segment => segment.isDefault)) {
      Object.keys(constants.defaultProperties.application.segments).forEach((segmentName) => {
        appObject.segments[segmentName] = appObject.segments[segmentName] || {};
        appObject.segments[segmentName].isDefault = !!appObject.segments[segmentName].isDefault;
      });
    }

    logger.debug('Updating the application in database', paramsObject.appId);

    try {
      const result = await applicationDataService.updateApplication(paramsObject.appId, helper.flattenObject(appObject));
      logger.debug('Successfully updated application settings');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while updating application settings', err);
      throw err;
    }
  }

  async downloadApplication(paramsObject, downloadObject, auth) {
    const packager = new Packager(paramsObject.appId);

    try {
      const dataPath = await packager.generate(downloadObject, auth);
      logger.debug('Successfully created app archive for download');
      return dataPath;
    } catch (err) {
      logger.error('Error while creating app download archive', err);
      throw err;
    }
  }

  async deleteApplication(paramsObject, query) {
    try {
      const { database, resourceId } = await commonServices.application.getApplicationData(paramsObject.appId, 'database', 'resourceId');
      const appManager = new ApplicationManager(paramsObject.appId);
      if (query.withBackup === 'true') {
        await appManager.createAppBackup(database);
      } else {
        await filer.deleteDirectory(`${constants.fs.paths.appRoot}/${paramsObject.appId}`);
      }
      logger.info('Deleting all existing app data', `${constants.fs.paths.appRoot}/${paramsObject.appId}`);
      await applicationDataService.deleteAllApplicationData(paramsObject.appId);
      await applicationDataService.deleteApplicationDatabase(database);
      await new ResourceManager().deleteResource(resourceId);
      logger.debug('App data deleted successfully');
    } catch (err) {
      logger.error('Error while deleting application', err);
      throw err;
    }
  }

  async getTags(paramsObject) {
    logger.debug('Executing query to get the list of tags.');
    try {
      const result = await applicationDataService.getTags(paramsObject.appId);
      logger.debug('Retrieved result from the database');
      return result;
    } catch (err) {
      logger.error('Error while getting apps list', err);
      throw err;
    }
  }

  async getScripts(paramsObject) {
    logger.debug('Executing query to get the list of scripts.');
    try {
      const result = await applicationDataService.getScripts(paramsObject.appId);
      logger.debug('Retrieved result from the database');
      return result.scripts || [];
    } catch (err) {
      logger.error('Error while getting scripts list', err);
      throw err;
    }
  }

  async uploadScript(paramsObject, fileObject) {
    logger.debug('Adding the scripts into database');
    const fileNames = [];
    const fileSavePath = `${constants.fs.paths.appRoot}/${paramsObject.appId}/${constants.appFolderMap.scripts}`;
    try {
      if (fileObject.folderData) {
        await Promise.all(fileObject.folderData.files.map(filePath => {
          const fileName = path.basename(filePath);
          fileNames.push(fileName);
          return filer.copyFile(`${filePath}`, `${fileSavePath}/${fileName}`);
        }));
      } else {
        fileNames.push(fileObject.fileData.name);
        await filer.copyFile(fileObject.fileData.path, `${fileSavePath}/${fileObject.fileData.name}`);
      }
      const result = await applicationDataService.addScript(paramsObject.appId, fileNames);
      logger.debug('Successfully added scripts');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while adding scripts', err);
      throw err;
    }
  }

  async deleteScript(paramsObject) {
    logger.debug('Deleting file from database');

    try {
      const result = await applicationDataService.deleteScript(paramsObject.appId, paramsObject.fileName);
      await filer.deleteFile(
        `${constants.fs.paths.appRoot}/${paramsObject.appId}/${constants.appFolderMap.scripts}/${paramsObject.fileName}`,
      );
      logger.debug('Successfully deleted file');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while deleting script', err);
      throw err;
    }
  }

  async uploadConfiguration(paramsObject, configObject, userObject) {
    logger.debug('Saving the configuration to database', paramsObject.actionId);

    try {
      new ConfigUploader(paramsObject.appId, userObject.username, true).upload(configObject);
      logger.debug('Successfully saved configuration');
    } catch (err) {
      logger.error('Error while saving configuration', err);
      throw err;
    }
  }

  async addShare(paramsObject, resourceObj) {
    logger.debug('Sharing the application with the user');
    try {
      logger.debug('Successfully shared application');
      const { resourceId, url } = await applicationDataService.getApplication(paramsObject.appId);
      return new ResourceManager().shareApp(resourceId, resourceObj.userId, resourceObj.scopes, resourceObj.updateac, url);
    } catch (err) {
      logger.error('Error while sharing application', err);
      throw err;
    }
  }

  async updateShare(paramsObject, resourceObj) {
    logger.debug('Updating the shared application with the user');
    try {
      const { resourceId, url } = await applicationDataService.getApplication(paramsObject.appId);
      logger.debug('Successfully updated the user share');
      return new ResourceManager().updateShare(resourceId, resourceObj.userId, resourceObj.scopes, resourceObj.updateac, url);
    } catch (err) {
      logger.error('Error while sharing application', err);
      throw err;
    }
  }

  async removeShare(paramsObject, requestObj) {
    logger.debug('Removing access from the application with the user');
    try {
      logger.debug('Successfully shared application');
      const { resourceId, url } = await applicationDataService.getApplication(paramsObject.appId);
      return new ResourceManager().removeShare(requestObj.userIds, resourceId, requestObj.updateac, url);
    } catch (err) {
      logger.error('Error while sharing application', err);
      throw err;
    }
  }

  async getSharedUsers(paramsObject, query) {
    logger.debug('Getting the shared user for application');
    try {
      const { resourceId } = await applicationDataService.getApplication(paramsObject.appId);
      return new ResourceManager().getSharedUsers(query, resourceId);
    } catch (err) {
      logger.error('Error while getting shared users ', err);
      throw err;
    }
  }

  async getSharedUserCount(paramsObject) {
    logger.debug('Retreving app shared user count');
    try {
      const { resourceId } = await applicationDataService.getApplication(paramsObject.appId);
      logger.debug('Successfully retrieved shared user count');
      return new ResourceManager().getSharedUserCount(resourceId);
    } catch (err) {
      logger.error('Error while sharing application', err);
      throw err;
    }
  }

  async getApplicationScopes(paramsObject, user) {
    logger.debug('Retreving application scopes for user');
    try {
      const { resourceId } = await applicationDataService.getApplication(paramsObject.appId);
      if (user.isAdmin) {
        return constants.scopes.admin;
      }
      const userScopes = await new ResourceManager().getUserScopes(user.sub, resourceId);
      logger.debug('Successfully retrieved user scopes for the app');
      return userScopes.map(scope => scope.name);
    } catch (err) {
      logger.error('Error while sharing application', err);
      throw err;
    }
  }
}

module.exports = new Application();
