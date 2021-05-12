const path = require('path');
const mongoConfig = require('config').get('database.mongo');

const dataServices = require('../../dataServices');
const ConfigUploader = require('./configUploader');
const TableauManager = require('../report/tableauManager');
const constants = require('../../common/constants');
const logger = require('../../common/logger');
const filer = require('../../common/filer');
const helper = require('../../common/helper');

class Manager {
  constructor(appId, appName, username) {
    this._appId = appId.toString();
    this._appName = appName;
    this._username = username;
    if (this._appName) this._safeAppName = this._generateSafeName(appName);
  }

  /**
   * Generates safe name with all special characters replaced by underscore (_)
   * @param {string} name Name from which safe name is to be generated
   * @return {string} Safe name
   */
  _generateSafeName(name) {
    return name.toLocaleLowerCase().replace(/[^\w\s]/g, '').replace(/[\s]/g, '_');
  }

  /**
   * Update report details with settings from the server. This is useful when app is restored with workbooks
   * @param {string} reportsPath The path containing all the reports
   */
  async _updateReports(reportsPath) {
    const reports = JSON.parse(await filer.readFile(`${reportsPath}/config.json`));
    const tableauManager = await new TableauManager(this._appId).signIn();
    const uniqueWorkbookNames = Array.from(new Set(reports.tableau.map(r => r.workbook)));
    const validatedReports = { tableau: [] };
    // Update the existing config with the new project, workbook names, create a copy of each workbook with new name only if they exist
    for (let index = 0; index < reports.tableau.length; index += 1) {
      const report = reports.tableau[index];
      const filePath = `${reportsPath}/${report.workbook}.twbx`;
      const newName = `workbook_${uniqueWorkbookNames.indexOf(report.workbook) + 1}__${this._appId}_${report.type}`;
      const newPath = `${reportsPath}/${newName}.twbx`;

      if (await filer.pathExists(filePath)) {
        if (!await filer.pathExists(newPath)) await filer.copyFile(filePath, newPath);
        report.url = report.url.replace(/^.*\/views\//, `${tableauManager.config.server}/views/`)
          .replace(report.workbook, newName);
        report.project = tableauManager.config.projectName;
        report.workbook = newName;
        validatedReports.tableau.push(report);
      }
    }
    // Delete workbooks with old names and save config
    await Promise.all(uniqueWorkbookNames.map(name => filer.deleteFile(`${reportsPath}/${name}.twbx`)));
    await filer.writeFile(`${reportsPath}/config.json`, JSON.stringify(validatedReports, null, 4));
  }

  /**
   * Gets unique app url for this app from safe name and count of urls with same safe name to avoid conflict
   * @return {string} Unique URL for this application
   */
  async getUrl() {
    const sameUrlAppCount = await dataServices.application.getAppCountByUrlBeginning(this._safeAppName);
    return sameUrlAppCount ? `${this._safeAppName}_${sameUrlAppCount}` : this._safeAppName;
  }

  /**
   * Gets unique database name for this app from safe name and application ID
   * @return {string} Unique database name for this application
   */
  getDatabaseName() {
    return `${this._safeAppName}_${this._appId}`;
  }

  /**
   * Gets unique queue name for this app based on safe name and randomly generated string
   * @return {string} Unique queue name for this application
  */
  getQueueName() {
    return `${this._safeAppName}_queue_${helper.getRandomString(12)}`;
  }

  /**
   * Creates application directory using application Id containing necessary sub-direcrtories
   */
  async createAppDirectory() {
    logger.info('Creating app directory and sub-directories');
    const appDirRoot = `${constants.fs.paths.appRoot}/${this._appId}`;

    await filer.createDirectory(appDirRoot);
    await Promise.all(
      Object.values(constants.fs.directories.app).map(async (directoryName) => {
        const directoryPath = `${appDirRoot}/${directoryName}`;
        if (!await filer.pathExists(directoryPath)) {
          await filer.createDirectory(directoryPath);
        }
      }),
    );
  }

  /**
   * Creates application backup from mongo and postgres databases, and file system
   * @param {*} databaseDetails Database details of the application
   */
  async createAppBackup(databaseDetails) {
    const appDirPath = `${constants.fs.paths.appRoot}/${this._appId}`;
    const backupPath = `${constants.fs.paths.appRoot}/backup`;
    const backupZip = `${backupPath}/${this._appId}.zip`;
    const query = `'{$or: [{ _id: ObjectId("${this._appId}") }, { appId: ObjectId("${this._appId}") }]}'`;
    logger.info('Creating backup', backupPath);
    if (await filer.pathExists(appDirPath)) {
      const dumpFilePathPostgres = `${appDirPath}/appdb.dump`;
      const dumpFilePathMongo = `${appDirPath}`;
      await helper.generatePostgresDump(dumpFilePathPostgres, databaseDetails);
      await helper.generateMongoDump(dumpFilePathMongo, mongoConfig, constants.collection.names, query);
      if (!await filer.pathExists(backupPath)) {
        await filer.createDirectory(backupPath);
      }
      logger.info('Compressing backup data', backupZip);
      await filer.compressToArchive(backupZip, appDirPath);
    }
  }

  /**
   * Upload application data parsed from uploaded app folder
   * @param {object} appObject Application body object from parsed create application request
   */
  async uploadApplicationData(appObject) {
    const { config, folderData, tableData } = appObject;
    const appRoot = `${constants.fs.paths.appRoot}/${this._appId}`;
    const scriptsDirectory = folderData.directories.find(directory => path.basename(directory.path) === constants.appFolderMap.scripts);
    const dbDirPath = `${folderData.path}/${constants.appFolderMap.database}`;
    const reportsPath = `${folderData.path}/${constants.appFolderMap.reports}`;
    // Copy all the table source files into the application directory
    await Promise.all(Object.values(tableData).map(async (tableDetails) => {
      return filer.copyFile(tableDetails.path, tableDetails.path.replace(folderData.path, appRoot));
    }));

    if (scriptsDirectory) {
      const scripts = [];
      if (scriptsDirectory.directories) {
        const addFilesInDir = (scripts, directory) => {
          scripts.push(...directory.files.map(filePath => filePath.split(`${constants.appFolderMap.scripts}/`)[1]));
          directory.directories.forEach(subdir => addFilesInDir(scripts, subdir));
        };
        addFilesInDir(scripts, scriptsDirectory);
      }

      const defaultScript = scripts.find(scriptName => scriptName.split('.', 1)[0] === constants.string.defaultScriptName);
      // If the default script file has been uploaded, create the corresponding action
      if (defaultScript) {
        dataServices.action.createAction({
          environment: constants.string.defaultEnvironment,
          appId: this._appId,
          type: constants.types.action.primary,
          fileName: defaultScript,
          instanceType: constants.types.instance.default,
          ...helper.getAuditProperties(this._username),
        });
      }
      // Copy all the script files into the application directory
      await filer.copyDirectory(scriptsDirectory.path, scriptsDirectory.path.replace(folderData.path, appRoot));
      await dataServices.application.updateApplication(this._appId, { scripts });
    }
    if (await filer.pathExists(dbDirPath)) await filer.copyDirectory(dbDirPath, dbDirPath.replace(folderData.path, appRoot));
    if (await filer.pathExists(reportsPath)) {
      await this._updateReports(reportsPath);
      await filer.copyDirectory(reportsPath, reportsPath.replace(folderData.path, appRoot));
    }
    // Upload application configuration to database
    await new ConfigUploader(this._appId, appObject.username).upload(config);
  }

  /**
    * Generates unique database username for dba role
    */
  getUserDataForRoles(role) {
    return {
      roleName: `eds_${this._appId}_${role}`,
      dbusername: `eds_${this._appId}_${role}u`,
      dbpassword: helper.getRandomString(16),
    };
  }
}

module.exports = Manager;
