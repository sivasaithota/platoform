const path = require('path');

const filer = require('../../common/filer');
const constants = require('../../common/constants');
const logger = require('../../common/logger');

class ConfigParser {
  _convertColumns(columns) {
    // Columns with initOrder are sorted to the beginning, columns without initOrder are left unchanged at the end
    const sortedColums = [
      ...columns.filter(obj => obj.initOrder).sort((colA, colB) => colA.initOrder - colB.initOrder),
      ...columns.filter(obj => !obj.initOrder),
    ];

    return sortedColums.map((column) => {
      return {
        name: column.columnName,
        displayName: column.displayName,
        datatype: column.type,
        isVisible: column.visible.value,
        isEditable: column.editable.value,
        hasFilter: column.filter || false,
      };
    });
  }

  _convertTables(config) {
    const tables = [];
    ['input', 'output'].forEach((type) => {
      if (!config[type]) return;
      config[type].forEach((table, index) => {
        tables.push({
          name: table.tableName,
          displayName: table.displayName,
          fileName: table.fileName,
          type,
          tag: {
            name: table.tag.tagName,
            class: table.tag.class,
          },
          isVisible: table.visible == null ? true : table.visible,
          typePosition: index,
          columns: this._convertColumns(table[`${type}Colums`]),
        });
      });
    });
    return tables;
  }

  _convertViews(views) {
    const result = [];
    ['input', 'output'].forEach((type) => {
      if (!views[type]) return;
      views[type].forEach((view) => {
        result.push({
          name: view.viewName,
          displayName: view.displayName,
          definition: view.definition,
          type,
          tag: {
            name: view.tag.tagName,
            class: view.tag.class,
          },
          columns: this._convertColumns(view.columns),
        });
      });
    });
    return result;
  }

  _convertParameters(config) {
    const typeMap = {
      3: 'dropdownMultiple',
      4: 'dropdownSingle',
      5: 'switch',
    };

    const validationMap = {
      text: 'inputBox',
      numeric: 'inputBox',
      date: 'dateField',
    };

    return config.parameter.map((group) => {
      return {
        name: group.groupName,
        isCollapsed: false,
        parameters: group.parameters.map((parameter) => {
          return {
            name: parameter.displayName,
            alias: parameter.type >= 3 && parameter.type <= 4 ? parameter.displayName : parameter.parameter[0],
            type: typeMap[parameter.type] || validationMap[parameter.validation],
            ...(parameter.type >= 3 && parameter.type <= 4 ? { dropdownValues: parameter.parameter } : {}),
            ...(parameter.validation ? { isNumeric: parameter.validation === 'numeric' } : {}),
            defaultValue: parameter.validation === 'date' ? new Date(parameter.defaultValue).toLocaleDateString() : parameter.defaultValue,
            tooltip: parameter.tooltip,
            isRequired: false,
          };
        }),
      };
    });
  }

  _convertParameterOptions(config) {
    return config.parameterOptions;
  }

  _convertEditOptions(config) {
    return config.editOptions;
  }

  _convertMacros(config) {
    return config.macros.map((macro) => {
      if (macro.name) return macro;
      return {
        environment: constants.string.defaultEnvironment,
        segment: macro.segment,
        fileName: macro.fileName,
        name: macro.actionDesc,
        instanceType: constants.types.instance.default,
        type: constants.types.action.secondary,
        description: macro.description,
      };
    });
  }

  _convertTableau(config) {
    return config.tableau;
  }

  _convertTemplates(config) {
    return config.templateList.templates;
  }

  _convertRowView(config) {
    return config.rowView;
  }

  _convert(config) {
    let result = {};

    if (!config.version) {
      if (config.input || config.output) result.tables = this._convertTables(config);
      if (config.parameter) result.parameterGroups = this._convertParameters(config);
      if (config.editOptions) result.editOptions = this._convertEditOptions(config);
      if (config.parameterOptions) result.parameterOptions = this._convertParameterOptions(config);
      if (config.tableau) result.tableau = this._convertTableau(config);
      if (config.templateList) result.templates = this._convertTemplates(config);
      if (config.view) result.views = this._convertViews(config.view);
      if (config.rowView) result.rowView = this._convertRowView(config);
    } else result = config;
    if (config.macros) result.macros = this._convertMacros(config);

    return result;
  }

  async parseConfigFiles(filePaths) {
    const configData = {};
    await Promise.all(
      filePaths.map(async filePath => {
        try {
          if (constants.types.config.includes(path.basename(filePath))) {
            Object.assign(configData, JSON.parse(await filer.readFile(filePath)));
          }
        } catch (err) {
          logger.error('Error reading config JSON', err);
          const errorMessage = `${constants.file.readError} - ${path.basename(filePath)}`;
          throw errorMessage;
        }
      }),
    );
    return this._convert(configData);
  }

  async parseConfigFile(filePath) {
    try {
      return this._convert(JSON.parse(await filer.readFile(filePath)));
    } catch (err) {
      logger.error('Error reading config JSON', err);
      const errorMessage = `${constants.file.readError} - ${path.basename(filePath)}`;
      throw errorMessage;
    }
  }
}

module.exports = new ConfigParser();
