const commonValidator = require('../common');
const constants = require('../../../common/constants');

const commonValidations = {
  boolean: {
    method: commonValidator.type.validateBoolean,
    message: 'Must be a true/false boolean value',
  },
  string: {
    any: {
      method: value => commonValidator.type.validateString(value, /^.*$/),
      message: 'Must be a valid text value',
    },
    anyMultiline: {
      method: value => commonValidator.type.validateString(value, /^[\s\S]*$/),
      message: 'Must be a valid text value',
    },
    nonEmpty: {
      method: commonValidator.type.validateString,
      message: 'Must be a valid non-empty text value',
    },
    word: {
      method: value => commonValidator.type.validateString(value, /^\w+$/),
      message: 'Must be a valid text value consisting of alphanumeric characters or undescore(_)',
    },
    objectId: {
      method: value => commonValidator.type.validateObjectId(value),
      message: 'Must be a 24-character hexadecimal object id',
    },
    relationName: {
      method: value => commonValidator.type.validateString(value, /^[^'",&]+$/),
      message: 'Must be a non-empty text value not containing quotation marks (\'"), comma (,) or ampersand (&)',
    },
  },
  integer: {
    method: value => commonValidator.type.validateNumber(value, true),
    message: 'Must be an integer',
  },
  array: {
    method: commonValidator.type.validateArray,
    message: 'Must be an array',
  },
  object: {
    method: commonValidator.type.validateObject,
    message: 'Must be an object with at least one property',
  },
  type: {
    table: {
      method: value => constants.types.table.includes(value),
      message: `Must be a valid type (${constants.types.table.join('|')})`,
    },
    date: {
      method: commonValidator.type.validateDateString,
      message: 'Must consist of validate dates in ISO format (YYYY-MM-DD)',
    },
  },
};

const commonProperties = {
  application: {
    name: {
      validations: [{
        method: value => commonValidator.type.validateString(value, /^[a-zA-Z0-9- ]+$/),
        message: 'Must be a valid text value containing only alphanumeric characters, hyphens and spaces',
      }],
    },
    segment: {
      isObject: true,
      properties: {
        name: {
          validations: [commonValidations.string.nonEmpty],
        },
        isVisible: {
          validations: [commonValidations.boolean],
        },
        isDefault: {
          validations: [commonValidations.boolean],
        },
      },
    },
  },
  editOptionsSegment: {
    isArray: true,
    validations: [commonValidations.array],
    properties: {
      tableName: {
        validations: [commonValidations.string.nonEmpty],
      },
      columns: {
        isArray: true,
        validations: [commonValidations.array],
        properties: {
          columnName: {
            validations: [commonValidations.string.nonEmpty],
          },
          dependent_schema: {
            validations: [commonValidations.string.any],
          },
          dependent_table: {
            validations: [commonValidations.string.any],
            requiredWhen: object => object.dependent_column,
          },
          dependent_column: {
            validations: [commonValidations.string.any],
            requiredWhen: object => object.dependent_table,
          },
          custom_sql: {
            validations: [commonValidations.string.any],
          },
          custom_values: {
            validations: [commonValidations.boolean],
          },
          parent_column_name: {
            validations: [commonValidations.string.any],
          },
        },
      },
    },
  },
  tableTag: {
    isObject: true,
    validations: [commonValidations.object],
    properties: {
      name: {
        validations: [commonValidations.string.nonEmpty],
        isRequired: true,
      },
      class: {
        validations: [{
          method: value => value in constants.types.tagClasses,
          message: 'Must be a valid tag class',
        }],
        default: constants.defaultProperties.table.tag.class,
      },
    },
    default: constants.defaultProperties.table.tag,
  },
  tableauSegment: {
    isArray: true,
    validations: [commonValidations.array],
    properties: {
      id: {
        validations: [commonValidations.string.any],
      },
      type: {
        validations: [commonValidations.string.any],
      },
      url: {
        validations: [commonValidations.string.any],
      },
      label: {
        validations: [commonValidations.string.any],
      },
      project: {
        validations: [commonValidations.string.any],
      },
      workbook: {
        validations: [commonValidations.string.any],
      },
    },
  },
  themeColor: {
    validations: [{
      method: value => commonValidator.type.validateString(value, /^#[0-9A-Za-z]{6}$/),
      message: 'Must be a valid color string beginning with (#) followed by a 6-character hexadecimal value',
    }],
    isRequired: true,
  },
};

module.exports = {
  createApplicationProperties: {
    name: commonProperties.application.name,
  },
  updateApplicationProperties: {
    name: commonProperties.application.name,
    displayName: {
      validations: [{
        method: value => commonValidator.type.validateString(value, /^[^']+$/),
        message: 'Must be a valid text value not containing single quote characters (\')',
      }],
    },
    description: {
      validations: [commonValidations.string.anyMultiline],
    },
    url: {
      validations: [commonValidations.string.word],
    },
    isPrivate: {
      validations: [commonValidations.boolean],
    },
    theme: {
      validations: [commonValidations.object],
      properties: {
        id: {
          validations: [commonValidations.string.objectId],
        },
        colorIndex: {
          validations: [commonValidations.number],
        },
      },
    },
    database: {
      isObject: true,
      validations: [commonValidations.object],
      properties: {
        serverName: {
          validations: [commonValidations.string.word],
        },
        port: {
          validations: [{
            method: value => commonValidator.type.validateNumber(value, true, 1, 65536),
            message: 'Must be a valid number between 1 and 65536',
          }],
        },
        username: {
          validations: [commonValidations.string.nonEmpty],
        },
        password: {
          validations: [commonValidations.string.nonEmpty],
        },
        databaseName: {
          validations: [commonValidations.string.nonEmpty],
        },
        isExisting: {
          validations: [commonValidations.boolean],
        },
      },
    },
    segments: {
      isObject: true,
      validations: [
        commonValidations.object,
        {
          method: value => Object.keys(value).every(key => key in constants.defaultProperties.application.segments
            && commonValidator.type.validateObject(value[key])),
          message: 'All segments must be valid non-empty objects',
        },
      ],
      properties: {
        inputs: commonProperties.application.segment,
        parameters: commonProperties.application.segment,
        outputs: commonProperties.application.segment,
      },
      postValidations: [
        {
          method: value => Object.values(value).reduce((defaultCount, segment) => defaultCount + segment.isDefault, 0) === 1,
          message: 'Exactly one segment should have isDefault set to true',
        },
      ],
    },
    status: {
      validations: [{
        method: value => Object.values(constants.string.application.status).find(status => status === value),
        message: `Must be a valid application status (${Object.keys(constants.string.application.status).join('|')})`,
      }],
    },
  },
  actionProperties: {
    type: {
      validations: [{
        method: value => value in constants.types.action,
        message: `Must be a valid action type (${Object.keys(constants.types.action).join('|')})`,
      }],
      isRequired: true,
    },
    segment: {
      validations: [{
        method: value => constants.types.table.includes(value),
        message: `Must be a valid segment (${constants.types.table.join('|')})`,
      }],
      requiredWhen: object => object.type !== constants.types.action.primary,
    },
    name: {
      validations: [commonValidations.string.nonEmpty],
      requiredWhen: object => object.type !== constants.types.action.primary,
    },
    description: {
      validations: [commonValidations.string.anyMultiline],
    },
    fileName: {
      method: value => commonValidator.type.validateString(value, /^[a-zA-Z0-9._\-]{3,}$/),
      requiredWhen: object => [constants.types.action.primary, constants.types.action.second],
      message: `Must be a valid filename and should not contain any special character other than [-_]`,
    },
    environment: {
      validations: [commonValidations.string.nonEmpty],
      requiredWhen: object => [constants.types.action.primary, constants.types.action.secondary].includes(object.type),
    },
    version: {
      validations: [commonValidations.string.nonEmpty],
    },
    instanceType: {
      validations: [{
        method: value => value in constants.types.instance,
        message: `Must be a valid instance type (${Object.keys(constants.types.instance).join('|')})`,
      }],
    },
    downloadFile: {
      validations: [commonValidations.string.nonEmpty],
      requiredWhen: object => object.type === constants.types.action.download,
    },
    isScenarioSpecific: {
      validations: [commonValidations.boolean],
      requiredWhen: object => [constants.types.action.download, constants.types.action.upload].includes(object.type),
    },
    lastAccessedAt: {
      validations: [commonValidations.type.date],
    },
    lastAccessedBy: {
      validations: [commonValidations.string.any],
    },
  },
  triggerProperties: {
    type: {
      validations: [{
        method: value => value in constants.types.trigger,
        message: `Must be a valid trigger type (${Object.keys(constants.types.trigger).join('|')})`,
      }],
      isRequired: true,
    },
    actionId: {
      validations: [commonValidations.string.objectId],
      isRequired: true,
    },
    tableId: {
      validations: [commonValidations.string.objectId],
      requiredWhen: object => [constants.types.trigger.tableUpload].includes(object.type),
    },
    scenarioId: {
      validations: [commonValidations.integer],
      requiredWhen: object => [constants.types.trigger.tableUpload].includes(object.type),
    },
    isEnabled: {
      validations: [commonValidations.boolean],
      isRequired: true,
    },
  },
  tableProperties: {
    name: {
      validations: [commonValidations.string.relationName],
      isRequired: true,
    },
    displayName: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    isVisible: {
      validations: [commonValidations.boolean],
      isRequired: true,
    },
    tag: commonProperties.tableTag,
    type: {
      validations: [commonValidations.type.table],
      isRequired: true,
    },
    columns: {
      validations: [
        commonValidations.array,
        {
          method: (value) => new Set(value.map(column => column.name)).size === value.length,
          message: 'Uploaded columns must not contain duplicate names',
        },
      ],
    },
  },

  moveTableProperties: {
    tableIds: {
      validations: [
        commonValidations.array,
        {
          method: (value) => value.every(id => commonValidator.type.validateObjectId(id)),
          message: 'Table Ids bust be a 24-character hexadecimal object id',
        },
      ],
      isRequired: true,
    },
    newTag: commonProperties.tableTag,
  },
  columnProperties: {
    name: {
      validations: [commonValidations.string.relationName],
      isRequired: true,
    },
    displayName: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    datatype: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    length: {},
    precision: {},
    scale: {},
    isVisible: {
      validations: [commonValidations.boolean],
      isRequired: true,
    },
    hasFilter: {
      validations: [commonValidations.boolean],
      isRequired: true,
    },
    isEditable: {
      validations: [commonValidations.boolean],
      isRequired: true,
    },
    dependency: {
      isObject: true,
      validations: [commonValidations.object],
      properties: {
        schema: {
          validations: [commonValidations.string.any],
        },
        table: {
          validations: [commonValidations.string.any],
          requiredWhen: object => !!object.column,
        },
        column: {
          validations: [commonValidations.string.any],
          requiredWhen: object => !!object.table,
        },
        parentColumn: {
          validations: [commonValidations.string.any],
        },
        customSql: {
          validations: [commonValidations.string.any],
        },
        customValues: {
          validations: [commonValidations.boolean],
        },
      },
    },
  },
  parameterGroupProperties: {
    name: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    isCollapsed: {
      validations: [commonValidations.boolean],
      isRequired: true,
    },
  },
  parameterProperties: {
    name: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    alias: { validations: [commonValidations.string.nonEmpty] },
    type: {
      validations: [commonValidations.string.nonEmpty],
      requiredWhen: (object) => object.isNumeric || object.dropdownValues || object.defaultValue,
    },
    isNumeric: {},
    dropdownValues: {},
    defaultValue: {},
    tooltip: {
      validations: [commonValidations.string.anyMultiline],
    },
    isRequired: {
      validations: [commonValidations.boolean],
      isRequired: true,
    },
    dependency: {
      isObject: true,
      validations: [commonValidations.object],
      properties: {
        schema: {
          validations: [commonValidations.string.any],
        },
        table: {
          validations: [commonValidations.string.any],
          requiredWhen: object => !!object.column,
        },
        column: {
          validations: [commonValidations.string.any],
          requiredWhen: object => !!object.table,
        },
        parent: {
          isObject: true,
          properties: {
            groupName: {
              validations: [commonValidations.string.any],
              requiredWhen: object => !!object.parameterName,
            },
            parameterName: {
              validations: [commonValidations.string.any],
              requiredWhen: object => !!object.groupName,
            },
          },
        },
        customSql: {
          validations: [commonValidations.string.any],
        },
        customValues: {
          validations: [commonValidations.boolean],
        },
      },
    },
  },
  reportProperties: {
    type: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    url: {
      validations: [commonValidations.string.nonEmpty],
      requiredWhen: object => object.type && object.type !== constants.types.report.default,
      default: '',
    },
  },
  scheduleProperties: {
    name: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    description: {
      validations: [commonValidations.string.anyMultiline],
      isRequired: true,
    },
    type: {
      validations: [{
        method: value => Object.values(constants.types.schedule).includes(value),
        message: `Must be a valid schedule type (${Object.values(constants.types.schedule).join('|')})`,
      }],
      isRequired: true,
    },
    days: {
      validations: [
        commonValidations.array,
        {
          method: value => value.every(element => commonValidator.type.validateNumber(element, true, 0, 6)),
          message: 'Must consist of numbers representing the day of the week from 0 (Sunday) to 6 (Saturday)',
        },
      ],
      requiredWhen: object => object.type === constants.types.schedule.weekly,
    },
    dates: {
      validations: [
        commonValidations.array,
        {
          method: value => value.every(element => commonValidator.type.validateDateString(element)),
          message: 'Must consist of validate dates in ISO format (YYYY-MM-DD)',
        },
      ],
      requiredWhen: object => object.type === constants.types.schedule.custom,
    },
    runTime: {
      validations: [{
        method: value => commonValidator.type.validateString(value, /^([01]\d|2[0-3]):[0-5]\d$/),
        message: 'Must be a valid text in time format (HH:MM)',
      }],
      isRequired: true,
    },
    actions: {
      isArray: true,
      validations: [commonValidations.array],
      isRequired: true,
      properties: {
        scenarioId: {
          validations: [commonValidations.integer],
          isRequired: true,
        },
        actionId: {
          validations: [commonValidations.string.objectId],
          isRequired: true,
        },
      },
    },
    instanceType: {
      validations: [{
        method: value => value in constants.types.instance,
        message: `Must be a valid instance type (${Object.keys(constants.types.instance).join('|')})`,
      }],
      default: constants.types.instance.default,
    },
    isActive: {
      validations: [commonValidations.boolean],
    },
    deactivationReason: {
      validations: [commonValidations.string.anyMultiline],
      requiredWhen: object => object.isActive === false,
    },
  },
  editOptionsProperties: {
    input: commonProperties.editOptionsSegment,
    output: commonProperties.editOptionsSegment,
  },
  parameterOptionProperties: {
    displayName: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    groupName: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    dependency: {
      isObject: true,
      properties: {
        dependent_schema: {
          validations: [commonValidations.string.any],
        },
        dependent_table: {
          validations: [commonValidations.string.any],
        },
        dependent_column: {
          validations: [commonValidations.string.any],
        },
        parent_groupName: {
          validations: [commonValidations.string.any],
        },
        parent_displayName: {
          validations: [commonValidations.string.any],
        },
        parent_column_name: {
          validations: [commonValidations.string.any],
        },
        custom_sql: {
          validations: [commonValidations.string.any],
        },
        custom_values: {
          validations: [commonValidations.boolean],
        },
      },
    },
  },
  macroProperties: {
    segment: {
      validations: [commonValidations.type.table],
    },
    type: {
      validations: [{
        method: value => commonValidator.type.validateString(value, /^(secondary|primary|upload|download)$/),
        message: 'Must be a valid macro type (input_refresh|output_refresh|input_validation|output_validation|primary|secondary)',
      }],
    },
    name: {
      validations: [commonValidations.string.any],
    },
    fileName: {
      method: value => commonValidator.type.validateString(value, /^[a-zA-Z0-9._\-]{3,}$/),
    },
    environment: {
      validations: [commonValidations.string.any],
    },
    downloadFile: {
      validations: [commonValidations.string.any],
    },
    isScenarioSpecific: {
      validations: [],
    },
    description: {
      validations: [commonValidations.string.any],
    },
  },
  tableauProperties: {
    input: {
      ...commonProperties.tableauSegment,
      ...{ requiredWhen: object => object.tableauInput },
    },
    output: {
      ...commonProperties.tableauSegment,
      ...{ requiredWhen: object => object.tableauOutput },
    },
    tableauTrusted: {
      validations: [commonValidations.boolean],
    },
    tableauUsername: {
      validations: [commonValidations.string.any],
    },
    tableauExtract: {
      validations: [commonValidations.boolean],
    },
    tableauInput: {
      validations: [commonValidations.boolean],
    },
    tableauOutput: {
      validations: [commonValidations.boolean],
    },
  },
  templateProperties: {
    id: {
      validations: [commonValidations.integer],
      isRequired: true,
    },
    appId: {
      validations: [commonValidations.string.objectId],
      isRequired: true,
    },
    name: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    reset: {
      validations: [commonValidations.boolean],
      isRequired: true,
    },
  },
  viewProperties: {
    name: {
      validations: [commonValidations.string.relationName],
    },
    displayName: {
      validations: [commonValidations.string.nonEmpty],
    },
    definition: {
      validations: [commonValidations.string.nonEmpty],
    },
    type: {
      validations: [commonValidations.type.table],
    },
    tag: commonProperties.tableTag,
  },
  rowViewProperties: {
    table: {
      validations: [commonValidations.string.nonEmpty],
    },
    type: {
      validations: [commonValidations.type.table],
    },
    columns: {
      isArray: true,
      validations: [commonValidations.array],
      properties: {
        name: {
          validations: [commonValidations.string.nonEmpty],
        },
        position: {
          validations: [commonValidations.integer],
        },
        order: {
          validations: [{
            method: value => commonValidator.type.validateNumber(value, true, 1),
            message: 'Must be a positive integer',
          }],
        },
      },
    },
  },
  themeProperties: {
    name: {
      validations: [commonValidations.string.any],
      isRequired: true,
    },
    disableFooter: {
      validations: [commonValidations.boolean],
      isRequired: true,
    },
    images: {
      validations: [
        commonValidations.object,
        {
          method: value => Object.values(value).every(imageName => !!imageName),
          message: `Must contain all images (${constants.types.themeImage.join(', ')})`,
        },
      ],
    },
    colorSchemes: {
      isArray: true,
      validations: [commonValidations.array],
      properties: {
        mainColor: commonProperties.themeColor,
        extraColor: commonProperties.themeColor,
        complimentaryColor: {
          ...commonProperties.themeColor,
          isRequired: false,
          default: constants.defaultProperties.customTheme.colorScheme.complimentaryColor,
        },
      },
    },
  },
  settingProperties: {
    tableau: {
      validations: [commonValidations.object],
    },
    powerbi: {
      isObject: true,
      validations: [commonValidations.object],
      properties: {
        servicePrincipalKey: {
          validations: [commonValidations.string.nonEmpty],
        },
        applicationId: {
          validations: [commonValidations.string.nonEmpty],
        },
        tenantId: {
          validations: [commonValidations.string.nonEmpty],
        },
      },
    },
    acceptedDomains: {
      validations: [
        commonValidations.array,
        {
          method: value => value.every(domain => commonValidator.type.validateString(domain, /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/)),
          message: 'Must be a valid domain name',
        },
      ],
    },
  },
  environmentProperties: {
    description: {
      validations: [commonValidations.string.anyMultiline, commonValidations.string.nonEmpty],
      isRequired: true,
    },
    baseImage: {
      validations: [commonValidations.string.nonEmpty],
    },
    name: {
      validations: [commonValidations.string.nonEmpty],
      isRequired: true,
    },
    locked: {
      validations: [commonValidations.boolean],
      isRequired: true,
    },
    commands: {
      validations: [commonValidations.array],
    },
    registry: {
      validations: [commonValidations.string.nonEmpty],
      requiredWhen: object => object.type && object.type === constants.types.environment.custom,
    },
  },
};
