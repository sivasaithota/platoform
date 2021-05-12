const commonServices = require('../common');
const applicationDataService = require('../../dataServices').application;
const filer = require('../../common/filer');
const constants = require('../../common/constants');
const logger = require('../../common/logger');

class ConfigUploader {
  constructor(appId, username) {
    this._appId = appId;
    this._auditObject = {
      createdBy: username,
      createdAt: new Date(),
    };
  }

  async _uploadTables(tables) {
    tables.forEach((table) => {
      table.columns.forEach((column) => Object.assign(column, this._auditObject));
      Object.assign(table, this._auditObject);
    });
    const result = await commonServices.table.replaceAllTablesInApplication(this._appId, tables);

    await Promise.all(
      result.deletedTables.map(table => filer.deleteFile(`${constants.fs.paths.appRoot}/${this._appId}/${table.type}/${table.fileName}`)),
    );
  }

  async _uploadParameterGroups(parameterGroups) {
    await Promise.all(
      parameterGroups.map(async (group) => {
        group.parameters.forEach(parameter => Object.assign(parameter, this._auditObject));
        Object.assign(group, this._auditObject);
        if (group.parameters.length) {
          group.refParameters = Object.values(await commonServices.parameter.createParameters(this._appId, group.parameters));
        }
        delete group.parameters;
      }),
    );
    await commonServices.parameter.replaceAllParameterGroupsInApplication(this._appId, parameterGroups);
  }

  async _uploadEditOptions(editOptions) {
    await applicationDataService.updateConfiguration(this._appId, 'editOptions', editOptions);
  }

  async _uploadParameterOptions(parameterOptions) {
    await applicationDataService.updateConfiguration(this._appId, 'parameterOptions', parameterOptions);
  }

  async _uploadMacros(macros) {
    macros.map(macro => Object.assign(macro, this._auditObject));
    await commonServices.action.replaceAllActionData(this._appId, macros);
  }

  async _uploadTableau(tableau) {
    await applicationDataService.updateConfiguration(this._appId, 'tableau', tableau);
  }

  async _uploadTemplates(templates) {
    await applicationDataService.updateConfiguration(this._appId, 'templates', templates);
  }

  async _uploadViews(views) {
    await applicationDataService.updateConfiguration(this._appId, 'views', views);
  }

  async _uploadRowView(rowView) {
    await applicationDataService.updateConfiguration(this._appId, 'rowView', rowView);
  }

  async upload(config) {
    logger.info('Uploading configuration');
    if (config.tables) await this._uploadTables(config.tables);
    if (config.parameterGroups) await this._uploadParameterGroups(config.parameterGroups);
    if (config.editOptions) await this._uploadEditOptions(config.editOptions);
    if (config.parameterOptions) await this._uploadParameterOptions(config.parameterOptions);
    if (config.macros) await this._uploadMacros(config.macros);
    if (config.tableau) await this._uploadTableau(config.tableau);
    if (config.templates) await this._uploadTemplates(config.templates);
    if (config.views) await this._uploadViews(config.views);
    if (config.rowView) await this._uploadRowView(config.rowView);
    logger.debug('Configuration uploaded successfully');
  }
}

module.exports = ConfigUploader;
