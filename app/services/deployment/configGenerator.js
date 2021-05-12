const dataServices = require('../../dataServices');
const commonServices = require('../../services/common');
const deploymentConstants = require('./configConstants');
const constants = require('../../common/constants');
const filer = require('../../common/filer');
const helper = require('../../common/helper');
const logger = require('../../common/logger');

class ConfigGenerator {
  constructor(appId, user) {
    this._appId = appId;
    this._user = user;
  }

  _getColumns(columns) {
    return columns.map((column, index) => {
      return {
        columnName: column.name,
        displayName: column.displayName,
        type: column.datatype,
        length: column.length,
        scale: column.scale,
        precision: column.precision,
        initOrder: index + 1,
        visible: {
          name: column.isVisible ? 'Yes' : 'No',
          value: column.isVisible,
        },
        editable: {
          name: column.isEditable ? 'Yes' : 'No',
          value: column.isEditable,
        },
        filter: column.hasFilter,
      };
    });
  }

  _getViews(views) {
    logger.debug('Generating view configuration');
    const result = constants.types.table.reduce((object, type) => Object.assign(object, { [type]: [] }), {});
    views.forEach((table) => {
      result[table.type].push({
        viewName: table.name,
        displayName: table.displayName,
        definition: table.definition,
        tag: {
          class: table.tag.class,
          tagName: table.tag.name,
        },
        columns: this._getColumns(table.columns),
      });
    });

    return result;
  }

  async _getAppDetails() {
    logger.debug('Generating application details');
    const appData = await dataServices.deployment.getAllApplicationData(this._appId);
    const settings = await dataServices.global.getSetting('acceptedDomains');

    return {
      Application_id: appData._id,
      ApplicationName: appData.name,
      ApplicationDisplayName: appData.displayName,
      ApplicationAuthor: appData.createdBy,
      ApplicationDescription: appData.description,
      appUrl: appData.url,
      userInfo: { user: { username: this._user.username, useremail: this._user.email } },
      database: {
        dbserverName: appData.database.serverName,
        port: appData.database.port.toString(),
        dbusername: appData.database.roles.readWrite.dbusername,
        dbpassword: appData.database.roles.readWrite.dbpassword,
        dbname: appData.database.databaseName,
      },
      scriptFileList: appData.scripts ? appData.scripts.map((fileName, index) => ({ fileName, scriptId: index + 1 })) : [],
      appSegments: Object.entries(appData.segments).sort((a, b) => a.order - b.order).map(([type, segment]) => {
        return {
          type,
          value: segment.name,
          visible: segment.isVisible,
          isDefault: segment.isDefault,
          edit: false,
        };
      }),
      privacyRules: !appData.isPrivate ? settings.acceptedDomains.map(domain => ({ domain })) : [],
    };
  }

  async _getAppTables() {
    logger.debug('Generating application tables');
    const tableData = await dataServices.table.getTables(this._appId, null, true);
    const result = {};

    result.tables = constants.types.table.reduce((object, type) => Object.assign(object, { [type]: [] }), {});
    tableData.forEach((table) => {
      result.tables[table.type].push({
        fileName: `${table.name}.csv`,
        tableName: table.name,
        displayName: table.displayName,
        tag: {
          class: table.tag.class,
          tagName: table.tag.name,
        },
        visible: table.isVisible,
        [`${table.type}Colums`]: this._getColumns(table.columns),
      });
    });

    return result;
  }

  async _getAppParameters() {
    logger.debug('Generating application parameters');
    const parameterData = await dataServices.parameter.getParameters(this._appId);
    const result = {};
    const typeMap = {
      inputBox: 1,
      dateField: 1,
      dropdownMultiple: 3,
      dropdownSingle: 4,
      switch: 5,
    };

    result.parameters = parameterData.map((group) => {
      return {
        groupName: group.name,
        parameters: group.parameters.map((parameter) => {
          const parameterRemap = {
            displayName: parameter.name,
            defaultValue: parameter.defaultValue,
            parameter: parameter.type.startsWith('dropdown') ? parameter.dropdownValues : [parameter.alias || parameter.name],
            type: typeMap[parameter.type],
            tooltip: parameter.tooltip,
          };
          if (parameterRemap.type === 1) {
            if (parameter.isNumeric == null) parameterRemap.validation = 'date';
            else parameterRemap.validation = parameter.isNumeric ? 'numeric' : 'text';
          }
          return parameterRemap;
        }),
      };
    });

    return result;
  }

  async _getAppConfigurations(existingConfig) {
    logger.debug('Generating application configurations');
    const configData = await dataServices.application.getConfigurations(this._appId);
    if (!configData) return {};
    // Fetcb application configs for all the template apps, store them in templateDefinitions
    if (configData.templates && configData.templates.length) {
      configData.templateList = { templates: Object.assign(configData.templates) };
      configData.templateDefinitions = {};
      await Promise.all(
        configData.templates.map(async (template) => {
          configData.templateDefinitions[template.id] = await commonServices.deployment.getAppConfigById(template.appId);
        }),
      );
      delete configData.templates;
    }
    // Set macro status for each segment type based on whether at least one macro of that type exists
    if (configData.views) {
      configData.view = this._getViews(configData.views);
      delete configData.views;
    }
    // Merge app-defined tableau config to enframe-defined tableau config, prioritizing config from app
    if (configData.tableau) {
      constants.types.table.forEach((type) => {
        if (!existingConfig.tableau[type]) return;
        if (!configData.tableau[type]) configData.tableau[type] = [];
        configData.tableau[type] = [].concat(
          configData.tableau[type].filter((report) => !existingConfig.tableau[type].find(({ label }) => label === report.label)),
          existingConfig.tableau[type],
        );
      });
      configData.tableau.tableauInput = configData.tableau.input && !!configData.tableau.input.length;
      configData.tableau.tableauOutput = configData.tableau.output && !!configData.tableau.output.length;
    }
    return configData;
  }

  async _getAppReports() {
    logger.debug('Generating application reports');
    const reportData = await dataServices.report.getReports(this._appId);

    if (reportData.length) {
      const report = reportData[0];
      return {
        htmlType: report.type === constants.types.report.default ? 'on' : report.type,
        html: true,
        htmlUrl: report.type === constants.types.report.shiny ? `/${report.type}/${report.url}/` : (report.url || ''),
      };
    }

    return {};
  }

  async generateAppConfig() {
    logger.info('Generating application metadata', this._appId);
    const appConfig = helper.getDeepCopy(deploymentConstants.applicationConfigTemplate);
    const appConfigPath = `${constants.fs.paths.appRoot}/${this._appId}/${constants.fs.filenames.applicationConfig}`;
    const existingConfig = await filer.pathExists(appConfigPath) ? JSON.parse(await filer.readFile(appConfigPath)) : appConfig;
    Object.assign(appConfig, await this._getAppDetails());
    Object.assign(appConfig, await this._getAppTables());
    Object.assign(appConfig, await this._getAppParameters());
    Object.assign(appConfig, await this._getAppReports());
    Object.assign(appConfig, await this._getAppConfigurations(existingConfig));

    return appConfig;
  }

  async generate() {
    const appConfig = await this.generateAppConfig();

    return {
      appConfig,
    };
  }
}

module.exports = ConfigGenerator;
