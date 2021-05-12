const path = require('path');

const dataServices = require('../../dataServices');
const constants = require('../../common/constants');
const filer = require('../../common/filer');
const logger = require('../../common/logger');
const helper = require('../../common/helper');
const RequestHelper = require('../../common/requestHelper');
const commonServices = require('../common');
const TableauManager = require('../report/tableauManager');

class Packager {
  constructor(appId) {
    this._appId = appId;
  }

  async generateConfig() {
    logger.info('Generating app download folder', this._appId);

    const configs = {};
    const configurationData = await dataServices.application.getConfigurations(this._appId);

    configs.TableConfig = { tables: await dataServices.table.getTables(this._appId, null, false, true) };
    configs.TableConfig.tables.forEach((table) => {
      delete table._id;
      table.columns.forEach(column => delete column._id);
    });
    configs.ParameterConfig = { parameterGroups: await dataServices.parameter.getParameters(this._appId) };

    configs.ParameterConfig.parameterGroups.forEach((group) => {
      delete group._id;
      group.parameters.forEach(parameter => delete parameter._id);
    });

    const macros = (await dataServices.action.getActions(this._appId))
      .filter(macro => macro.type !== constants.types.action.primary);
    macros.forEach((macro) => {
      delete macro._id;
      delete macro.lastAccessedAt;
      delete macro.lastAccessedBy;
    });
    if (macros.length) configs.MacrosConfig = { macros };

    if (configurationData) {
      const {
        editOptions, parameterOptions, tableau, views, rowView, templates,
      } = configurationData;
      if (editOptions) configs.EditTableConfig = { editOptions };
      if (parameterOptions) configs.ParameterOptionsConfig = { parameterOptions };
      if (tableau) configs.TableauConfig = { tableau };
      if (views) configs.ViewConfig = { views };
      if (rowView) configs.RowViewConfig = { rowView };
      if (templates) configs.TemplateConfig = { templates };
    }

    Object.values(configs).forEach(c => Object.assign(c, { version: '3.0.0' }));

    const configFolderPath = `${constants.fs.paths.appRoot}/${this._appId}/${constants.appFolderMap.config}`;

    await Promise.all(
      Object.entries(configs).map(([name, configData]) => {
        logger.debug('Writing to config', name);
        return filer.writeFile(`${configFolderPath}/${name}.json`, JSON.stringify(configData, null, 2));
      }),
    );
  }

  async generate(downloadObject, auth) {
    const tempDirPath = `/tmp/${helper.getRandomString(10)}`;
    const appUrl = (await dataServices.application.getApplication(this._appId)).url;
    const tempArchivePath = `/tmp/${appUrl}.zip`;
    const basePath = `${constants.fs.paths.appRoot}/${this._appId}`;
    const appFolderMap = { ...constants.appFolderMap };

    await filer.createDirectory(tempDirPath);

    if (downloadObject.config) {
      await this.generateConfig();
      const appDirectoryTree = await filer.getDirectoryTree(basePath);

      await Promise.all(
        Object.entries(appFolderMap).map(async ([plainName, internalName]) => {
          const directoryTree = appDirectoryTree.directories.find((directory => directory.path.endsWith(`${path.sep}${internalName}`)));
          if (directoryTree && directoryTree.files.length) {
            await filer.copyDirectory(directoryTree.path, path.join(tempDirPath, plainName));
          }
        }),
      );
    }

    if (downloadObject.scenarios.length) {
      const { database } = await commonServices.application.getApplicationData(this._appId, 'database');

      const schemas = await dataServices.application.getSchemas(database.databaseName, downloadObject.scenarios);

      const databaseFolder = `${tempDirPath}/${appFolderMap.database}`;

      await filer.createDirectory(databaseFolder);
      await helper.generatePostgresDump(`${databaseFolder}/scenariodata.dump`, database, schemas);
      logger.debug('Database dump generated', databaseFolder);
    }

    if (downloadObject.reports.length) await this.downloadWorkbooks(auth, tempDirPath);

    logger.debug('Download folder generated', tempDirPath);
    const tempDirectoryTree = await filer.getDirectoryTree(tempDirPath);
    await filer.compressToArchive(tempArchivePath, ...tempDirectoryTree.directories.map(directory => directory.path));
    filer.deleteDirectory(tempDirPath);
    logger.debug('Download archive generated', tempArchivePath);
    return tempArchivePath;
  }


  async downloadWorkbooks(auth, workbookPath) {
    const reportsPath = `${workbookPath}/${constants.appFolderMap.reports}`;
    const { url } = await commonServices.application.getApplicationData(this._appId, 'url', 'database');
    const { data } = await new RequestHelper(`http://router:80/apps/${url}/tableau`, { Authorization: auth }).makeRequest();
    const tableauManager = await new TableauManager().signIn();
    const workbookSet = new Set();

    await filer.createDirectory(reportsPath);
    await Promise.all(data.map((workbook) => {
      if (workbookSet.has(workbook.workbook)) return;
      workbookSet.add(workbook.workbook);
      const downloadPath = `${reportsPath}/${workbook.workbook}.twbx`;
      return tableauManager.downloadWorkbook(workbook, downloadPath);
    }));
    await filer.writeFile(`${reportsPath}/config.json`, JSON.stringify({ tableau: data }, null, 4));
  }
}

module.exports = Packager;
