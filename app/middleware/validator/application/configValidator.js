const commonServices = require('../../../services/common');
const commonValidator = require('../common');
const PropertyValidator = require('../../../common/propertyValidator');
const validationSchema = require('../common/validationSchema');
const helper = require('../../../common/helper');

class ConfigValidator {
  constructor() {
    this.error = null;
    this.validatedConfig = {};
    this.subValidationData = [];
  }

  async _validateTableColumns(columns, tableName, type) {
    const validatedColumns = new Array(columns.length);
    const columnValidator = new PropertyValidator(validationSchema.columnProperties);

    await Promise.all(
      columns.map(async (column, index) => {
        const validationResult = columnValidator.validate(column);

        if (!validationResult.isValid) {
          const [invalidPropertyName, error] = Object.entries(validationResult.invalidProperties)[0];
          this.error = `${type} '${tableName}' has column '${column.name}' with invalid ${invalidPropertyName} - ${error}`;
        } else {
          const typeValidationResult = await commonValidator.table.validateDatatype(column);
          if (!typeValidationResult.isValid) {
            const [invalidProperty, propertyError] = Object.entries(typeValidationResult.invalidProperties)[0];
            this.error = `${type} '${tableName}' has column '${column.name}' with invalid property '${invalidProperty}' - ${propertyError}`;
          } else {
            validatedColumns[index] = { ...validationResult.validatedObject, ...typeValidationResult.specificProperties };
          }
        }
        if (this.error) throw this.error;
      }),
    );

    return validatedColumns;
  }

  async _validateTables(tables, type) {
    const validatedTables = new Array(tables.length);
    const tableNameSet = new Set();
    const schema = type === 'View' ? validationSchema.viewProperties : validationSchema.tableProperties;
    const tableValidator = new PropertyValidator(schema);

    await Promise.all(
      tables.map(async (table, index) => {
        tableNameSet.add(table.name);
        const validationResult = tableValidator.validate(table);

        if (!validationResult.isValid) {
          const [invalidPropertyName, error] = Object.entries(validationResult.invalidProperties)[0];
          this.error = `${type} '${table.name}' has invalid ${invalidPropertyName} - ${error}`;
        } else if (tableNameSet.size === index) {
          this.error = `${type} '${table.name}' has a name that is already being used by a different table`;
        } else {
          validatedTables[index] = {
            ...validationResult.validatedObject,
            columns: await this._validateTableColumns(table.columns, table.name, type),
          };
        }
        if (this.error) throw this.error;
      }),
    );

    return validatedTables;
  }

  _validateGroupParameters(parameters, groupName) {
    this.subValidationData = new Array(parameters.length);
    const parameterNameSet = new Set();
    const parameterValidator = new PropertyValidator(validationSchema.parameterProperties);

    return parameters.every((parameter, index) => {
      const validationResult = parameterValidator.validate(parameter);

      if (!validationResult.isValid) {
        const [invalidPropertyName, error] = Object.entries(validationResult.invalidProperties)[0];
        this.error = `Group '${groupName}' has parameter '${parameter.name}' with invalid ${invalidPropertyName} - ${error}`;
      } else if (parameterNameSet.has(parameter.name)) {
        this.error = `Group '${groupName}' has parameter '${parameter.name}' with a name that is already being used by `
          + 'a different parameter in the same group';
      } else {
        const typeValidator = new commonValidator.ParameterType();
        if (!typeValidator.validate(parameter)) {
          const [invalidPropertyName, error] = Object.entries(typeValidator.invalidProperties)[0];
          this.error = `Group '${groupName}' has parameter '${parameter.name}' with invalid ${invalidPropertyName} - ${error}`;
          return false;
        }

        parameterNameSet.add(parameter.name);
        this.subValidationData[index] = { ...validationResult.validatedObject, ...typeValidator.specificProperties };
        return true;
      }
      return false;
    });
  }

  _validateParametersGroups(groups) {
    this.validatedConfig.parameterGroups = [];
    const groupNameSet = new Set();
    const groupValidator = new PropertyValidator(validationSchema.parameterGroupProperties);

    groups.every((group, index) => {
      const validationResult = groupValidator.validate(group);

      if (!validationResult.isValid) {
        const [invalidPropertyName, error] = Object.entries(validationResult.invalidProperties)[0];
        this.error = `Group '${group.name}' has invalid ${invalidPropertyName} - ${error}`;
      } else if (groupNameSet.has(group.name)) {
        this.error = `Group '${group.name}' has  a name that is already being used by a different group`;
      } else if (this._validateGroupParameters(group.parameters, group.name)) {
        groupNameSet.add(group.name);
        this.validatedConfig.parameterGroups[index] = { ...validationResult.validatedObject, parameters: this.subValidationData };
        return true;
      }
      return false;
    });
  }

  _validateEditOptions(editOptions) {
    const validationResult = new PropertyValidator(validationSchema.editOptionsProperties).validate(editOptions);

    if (!validationResult.isValid) {
      const [invalidPropertyName, error] = Object.entries(helper.flattenObject(validationResult.invalidProperties))[0];
      this.error = `Edit Options contain invalid property ${invalidPropertyName} - ${error}`;
    } else {
      this.validatedConfig.editOptions = validationResult.validatedObject;
      return true;
    }
    return false;
  }

  _validateParameterOptions(parameterOptions) {
    this.validatedConfig.parameterOptions = [];
    const groupValidator = new PropertyValidator(validationSchema.parameterOptionProperties);

    parameterOptions.every((parameter, index) => {
      const validationResult = groupValidator.validate(parameter);

      if (!validationResult.isValid) {
        const [invalidPropertyName, error] = Object.entries(validationResult.invalidProperties)[0];
        this.error = `Parameter Options for '${parameter.displayName}' in group '${parameter.groupName}' has invalid`
          + `${invalidPropertyName} - ${error}`;
      } else {
        this.validatedConfig.parameterOptions[index] = validationResult.validatedObject;
        return true;
      }
      return false;
    });
  }

  async _validateMacros(macros) {
    this.validatedConfig.macros = new Array(macros.length);
    const macroValidator = new PropertyValidator(validationSchema.macroProperties);

    await Promise.all(
      macros.map(async (macro, macroIndex) => {
        const validationResult = macroValidator.validate(macro);

        if (!validationResult.isValid) {
          const [invalidPropertyName, error] = Object.entries(validationResult.invalidProperties)[0];
          this.error = `Macro at index ${macroIndex} has invalid ${invalidPropertyName} - ${error}`;
        } else if (!(await commonServices.environment.getEnvironments(macro.environment))) {
          this.error = `Macro at index ${macroIndex} has an invalid environment`;
        } else {
          this.validatedConfig.macros[macroIndex] = validationResult.validatedObject;
        }
        if (this.error) throw this.error;
      }),
    );
  }

  _validateTableau(tableau) {
    const validationResult = new PropertyValidator(validationSchema.tableauProperties).validate(tableau);

    if (!validationResult.isValid) {
      const [invalidPropertyName, error] = Object.entries(validationResult.invalidProperties)[0];
      this.error = `Tableau config has invalid property ${invalidPropertyName} - ${error}`;
    } else {
      this.validatedConfig.tableau = validationResult.validatedObject;
      return true;
    }
    return false;
  }

  async _validateTemplates(templates) {
    this.validatedConfig.templates = new Array(templates.length);
    const templateValidator = new PropertyValidator(validationSchema.templateProperties);

    await Promise.all(
      templates.map(async (template, templateIndex) => {
        const validationResult = templateValidator.validate(template);
        if (!validationResult.isValid) {
          const [invalidPropertyName, error] = Object.entries(validationResult.invalidProperties)[0];
          this.error = `Template at index ${templateIndex} has invalid ${invalidPropertyName} - ${error}`;
        } else if (!(await commonServices.application.checkIfAppExistsById(template.appId))) {
          this.error = `Template at index ${templateIndex} has an appId that does not exist`;
        } else {
          this.validatedConfig.templates[templateIndex] = validationResult.validatedObject;
        }
        if (this.error) throw this.error;
      }),
    );
  }

  async _validateRowView(rowView) {
    this.validatedConfig.rowView = [];
    const rowViewValidator = new PropertyValidator(validationSchema.rowViewProperties);

    rowView.every((view, rowViewIndex) => {
      const validationResult = rowViewValidator.validate(view);
      if (!validationResult.isValid) {
        const [invalidPropertyName, error] = Object.entries(helper.flattenObject(validationResult.invalidProperties))[0];
        this.error = `Template at index ${rowViewIndex} has invalid ${invalidPropertyName} - ${error}`;
      } else {
        this.validatedConfig.rowView[rowViewIndex] = validationResult.validatedObject;
        return true;
      }
      return false;
    });
  }

  async validate(configData) {
    try {
      if (configData.tables) this.validatedConfig.tables = await this._validateTables(configData.tables, 'Table');
      if (configData.parameterGroups) this._validateParametersGroups(configData.parameterGroups);
      if (configData.editOptions) await this._validateEditOptions(configData.editOptions);
      if (configData.parameterOptions) this._validateParameterOptions(configData.parameterOptions);
      if (configData.macros) await this._validateMacros(configData.macros);
      if (configData.tableau) this._validateTableau(configData.tableau);
      if (configData.templates) await this._validateTemplates(configData.templates);
      if (configData.views) this.validatedConfig.views = await this._validateTables(configData.views, 'View');
      if (configData.rowView) this._validateRowView(configData.rowView);

      return this;
    } catch (err) {
      if (!this.error) {
        throw err;
      }
    }
  }
}

module.exports = ConfigValidator;
