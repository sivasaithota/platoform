// Service for constant values used across the app
import Vue from 'vue';
import message from '@/services/message';

// Injecting this module as a dependency to the Vue instance, so in the Vue components it can be used as $constant
Vue.mixin({
  beforeCreate() {
    const options = this.$options;
    if (options.constant) this.$constant = options.constant;
    else if (options.parent && options.parent.$constant) this.$constant = options.parent.$constant;
  },
});

export default {
  userRoles: {
    admin: 'Admin',
    architect: 'Architect',
    appDeveloper: 'App Developer',
    appViewer: 'App Viewer',
  },

  keycloakClients: {
    enframeBackend: 'enframe_backend',
  },

  appThemes: {
    default: 'default',
    alternative: 'alternative',
  },

  api: {
    enframe: '/api/v1/',
    deploy: '/api/deploy/',
    app: '/api/application/',
    appManager: '/apps/',
    userManagement: '/user-management/api/',
    jobProcessor: '/job_processor/api/v1/',
  },

  appSteps: {
    application: 'application',
    iop: 'iop',
    sv: 'sv',
    settings: 'settings',
    users: 'users',
    scriptFileList: 'scriptFileList',
  },

  appTypes: {
    shiny: 'shiny',
    acApp: 'acApp',
    featured: 'featured',
  },

  sortIndex: {
    asc: 'asc',
    desc: 'desc',
  },

  deployTypes: {
    shinyR: 'shiny',
    restart: 'restart',
    stop: 'stop',
    upgrade: 'upgrade',
    deploy: 'deploy',
    restore: 'restore',
  },
  deployStopPostfix: 'stopStatus',

  deployStatuses: {
    inProgress: 'IN-PROGRESS',
    active: 'ACTIVE',
    inactive: 'INACTIVE',
    deleted: 'DELETED',
    running: 'RUNNING',
    failure: 'FAILURE',
    success: 'SUCCESS',
    deploying: 'DEPLOYING',
    upgradeFailed: 'UPGRADE FAILED',
  },

  allowedTableFileExtensions: ['csv', 'xls', 'xlsx'],
  allowedConfigFileExtension: 'json',

  scriptExtensionCommandMapping: {
    py: 'python3',
    r: 'Rscript',
    sh: 'sh',
    js: 'node',
  },

  snackbarTypes: {
    success: 'success',
    error: 'error',
    info: 'info',
  },

  appFormats: {
    normal: 'normal',
    ticdat: 'ticdat',
  },

  uploadAreaStates: {
    pending: 'pending',
    uploading: 'uploading',
    error: 'error',
    success: 'success',
  },
  uploadAreaIcons: {
    cloud: 'cloud',
    config: 'config',
    folder: 'folder',
    script: 'script',
    table: 'table',
    image: 'image',
  },

  initialTableStructure: {
    name: '',
    displayName: '',
    tag: {
      class: 'tag-none',
      name: 'untagged',
    },
    isVisible: true,
  },

  initialColumnStructure: {
    name: '',
    displayName: '',
    datatype: '',
    isEditable: true,
    isVisible: true,
    hasFilter: false,
  },

  tableDatatype: {
    doublePrecision: 'double precision',
    varchar: 'varchar',
    numeric: 'numeric',
  },

  tagClasses: [
    'tag-red',
    'tag-orange',
    'tag-yellow',
    'tag-green',
    'tag-blue',
    'tag-violet',
    'tag-purple',
    'tag-pink',
  ],
  tagSupportClasses: {
    none: 'tag-none',
    new: 'tag-new',
  },

  segments: ['input', 'output'],

  actionLabels: {
    type: 'action type',
    segment: 'segment',
    name: 'action name',
    fileName: 'file name',
    description: 'action description',
    scriptToExecute: 'script to execute',
    commandToExecute: 'command to execute',
    environmentToExecute: 'environment',
    defaultEnv: 'default environments',
    customEnv: 'custom environments',
    instanceSizing: 'instance sizing',
    scenarioSpecific: 'scenario specific',
  },

  triggerLabels: {
    scenario: 'scenario',
    table: 'scenario table',
    action: 'action to execute',
  },

  actionTypes: {
    primary: {
      value: 'primary',
      text: 'Primary Action',
    },
    secondary: {
      value: 'secondary',
      text: 'Run Script',
    },
    upload: {
      value: 'upload',
      text: 'Upload',
    },
    download: {
      value: 'download',
      text: 'Download',
    },
  },

  instanceTypes: {
    default: {
      value: 'default',
      text: 'Runs on the same machine',
    },
    small: {
      value: 'small',
      text: 'Small (4 core, 16GB Machine)',
    },
    medium: {
      value: 'medium',
      text: 'Medium (8 Core, 32 GB Machine)',
    },
    large: {
      value: 'large',
      text: 'Large (16 Core, 64 GB Machine)',
    },
  },

  triggerPoints: {
    tableUpload: {
      value: 'tableUpload',
      text: 'Upload table',
      description: 'An action can be initiated with trigger point on uploading a particular scenario table',
    },
    tableEdit: {
      value: 'tableEdit',
      text: 'Edit table',
      description: 'An action can be initiated with trigger point on editing any scenario table',
    },
    scenarioCreation: {
      value: 'scenarioCreation',
      text: 'Create scenario',
      description: 'An action can be initiated with trigger point on creating a scenario',
    },
  },

  passwordRequirements: {
    minLength: {
      text: message.common.passwordMinLength,
      rule: value => value && value.length > 6,
    },
    lowercaseLetter: {
      text: message.common.passwordLowercaseLetter,
      rule: value => /.*[a-z].*/.test(value),
    },
    uppercaseLetter: {
      text: message.common.passwordUppercaseLetter,
      rule: value => /.*[A-Z].*/.test(value),
    },
    specialLetter: {
      text: message.common.passwordSpecialLetter,
      rule: value => /.*[#=+_.,?!@$%^&*~(){}<>-].*/.test(value),
    },
    numericLetter: {
      text: message.common.passwordNumericLetter,
      rule: value => /.*[0-9].*/.test(value),
    },
  },

  appDetailsLabels: {
    name: 'app name',
    displayName: 'app display name',
    description: 'app description',
  },

  htmlReportLabels: {
    type: 'report type',
    url: 'report url',
  },

  defaultAppSegments: [
    {
      type: 'inputs',
      value: 'input data',
      isDefault: true,
      visible: true,
    },
    {
      type: 'parameters',
      value: 'parameters',
      isDefault: false,
      visible: true,
    },
    {
      type: 'outputs',
      value: 'output data',
      isDefault: false,
      visible: true,
    },
  ],

  userTypes: {
    standalone: 'Standalone',
  },

  parameterTypes: {
    text: 'inputBox',
    date: 'dateField',
    radio: 'dropdownSingle',
    checkbox: 'dropdownMultiple',
    switch: 'switch',
  },

  // Query params for the checkUnique API request
  checkUniqueness: {
    type: {
      app: 'application',
      table: 'table',
      action: 'action',
    },
  },

  defaultGroupName: 'Group',

  themeGroups: {
    default: 'Default Themes',
    demo: 'Demo Themes',
    client: 'Client Themes',
    custom: 'Custom Themes',
  },

  themeImageTypes: {
    background: 'background',
    logo: 'logo',
    icon: 'icon',
  },

  downloadTypes: {
    tables: 'tables',
    schemas: 'schemas',
  },

  downloadOptions: [
    {
      name: 'Configuration Files',
      tab: 'config',
      headerText: 'Configuration files contain all the configuration information for that application.'
      + 'These files are useful to users who want to reproduce the settings of an app.',
    },
    {
      name: 'Scenario Data',
      tab: 'db',
      headerText: 'Scenario data including input, output and parameter tables will be downloaded as a database dump',
      selectTitle: 'Scenarios to be downloaded',
    },
    {
      name: 'Reports',
      tab: 'reports',
      headerText: 'Select the reports from the list that you want to download.',
      selectTitle: 'Reports to be downloaded',
    },
    // TODO uncomment for integration of other download options
  ],

  loginWarning: 'Please login to the application once to download scenario data and reports.',

  middleTruncationProps: {
    startStrLength: 12,
    endStrLength: 4,
    minIndentValue: 2,
  },

  scheduleRepeatTypes: {
    once: {
      value: 'once',
      text: 'Don\'t repeat',
    },
    daily: {
      value: 'daily',
      text: 'Daily',
    },
    weekly: {
      value: 'weekly',
      text: 'Weekly on',
    },
    custom: {
      value: 'custom',
      text: 'Custom',
    },
  },

  initialScheduleStructure: {
    name: '',
    description: '',
    type: 'once',
    scenarios: [
      {
        id: null,
        actionIds: [],
      },
    ],
  },

  createApp: {
    ticdat: {
      title: 'Ticdat',
      description: `I used the Ticdat framework to define my input and output
        table structure and Python scripts that convert the inputs to outputs`,
    },
    csv: {
      title: 'Scripts / .CSV Files',
      description: `I have .csv files that define my input and output table structure
        and scripts (e.g. Python, R, etc) that convert the inputs to outputs`,
      upload: {
        title: 'Uploading files error',
        description: 'Something went wrong',
      },
    },
  },

  enframeSetting: {
    tableau: 'tableau',
    powerbi: 'powerbi',
    acceptedDomains: 'acceptedDomains',
    excludeRoles: ['uma_protection'],
    actions: {
      addDomain: 'add',
      deleteDomain: 'delete',
    },
  },

  accessTypes: [
    {
      scopes: ['read', 'delete', 'update', 'create'],
      name: 'Edit Access',
      description: 'Complete access to app to edit',
    },
    {
      scopes: ['read'],
      name: 'View Access',
      description: 'View only access to the app',
    },
  ],

  environmentManagement: {
    name: '',
    description: '',
    baseImage: '',
    newCommands: '',
    logs: '',
    locked: true,
  },

  environmentTypes: {
    default: 'default',
    custom: 'custom',
  },
};
