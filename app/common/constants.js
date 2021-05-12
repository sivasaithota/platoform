const constants = {

  httpCodes: {
    success: 200,
    successfulCreate: 201,
    redirect: 302,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    internalServerError: 500,
    notImplemented: 501,
  },
  httpCodesList: [200, 201, 302, 400, 401, 403, 404, 409, 500, 501],
  health: {
    healthy: 'Platform is healthy',
  },
  roles: {
    admin: 'Admin',
    appDeveloper: 'App Developer',
    appViewer: 'App Viewer',
    adminRoles: ['Admin', 'Architect'],
  },
  acRoles: {
    consultant: 'Consultant',
    analystReadOnly: 'Analyst_ReadOnly',
  },
  scopes: {
    appViewer: ['read'],
    admin: ['create', 'read', 'update', 'delete'],
  },
  permissions: {
    app: {
      create: 'app:create',
      read: 'app:read',
      update: 'app:update',
      delete: 'app:delete',
    },
    actions: {
      create: 'action:create',
      read: 'action:read',
      update: 'action:update',
      delete: 'action:delete',
    },
    deployment: {
      create: 'deployment:create',
      delete: 'deployment:delete',
    },
    global: {
      create: 'global:create',
      read: 'global:read',
      update: 'global:update',
      delete: 'global:delete',
    },
    params: {
      create: 'parameters:create',
      read: 'parameters:read',
      update: 'parameters:update',
      delete: 'parameters:delete',
    },
    reports: {
      create: 'report:create',
      read: 'report:read',
      update: 'report:update',
      delete: 'report:delete',
    },
    schedule: {
      create: 'schedule:create',
      read: 'schedule:read',
      update: 'schedule:update',
      delete: 'schedule:delete',
    },
    sharing: {
      create: 'sharing:create',
      read: 'sharing:read',
      update: 'sharing:update',
      delete: 'sharing:delete',
    },
    table: {
      create: 'table:create',
      read: 'table:read',
      update: 'table:update',
      delete: 'table:delete',
    },
    theme: {
      create: 'theme:create',
      read: 'theme:read',
      update: 'theme:update',
      delete: 'theme:delete',
    },
    user: {
      create: 'user:create',
      read: 'user:read',
      update: 'user:update',
      delete: 'user:delete',
    },
  },
  authz: {
    GET: 'read', PATCH: 'update', POST: 'create', DELETE: 'delete',
  },
  authentication: {
    invalidJWT: 'Something went wrong while processing JWT token',
    noRoles: 'User does not have valid roles',
    unauthorizedDomain: 'You are not authorized to log into Enframe',
  },
  application: {
    get: {
      paramsInvalid: 'Invalid params found in URL for create application request',
      error: 'There was an error while getting apps from the server',
    },
    delete: {
      paramsInvalid: 'Invalid params found in URL for delete application request',
      noAppId: 'No app found with the provided App ID',
      queryInvalid: 'Invalid query found in delete application URL',
      error: 'There was an error while deleting application from the server',
    },
    getDetails: {
      noAppId: 'No app found with the provided App ID',
      paramsInvalid: 'Invalid params found in URL for get application request',
      error: 'There was an error while getting app details from the server',
    },
    create: {
      paramsInvalid: 'Invalid params found in URL for create app request',
      bodyInvalid: 'Invalid properties found in create app request',
      appExists: 'An application with the same name has already been created',
      parseError: 'There was an error while reading the contents of the uploaded app folder',
      error: 'There was an error while creating the app',
    },
    update: {
      paramsInvalid: 'Invalid params found in URL for update application request',
      bodyInvalid: 'Invalid properties found in update application request',
      noAppId: 'No app found with the provided App ID',
      urlUsed: 'The provided URL is already in use for another application',
      noThemeId: 'No theme exists with the provided Theme Id',
      error: 'Error encountered while updating application URL',
    },
    download: {
      paramsInvalid: 'Invalid params found in URL for delete application request',
      noAppId: 'No app found with the provided App ID',
      error: 'There was an error while downloading application from the server',
    },
    tags: {
      get: {
        paramsInvalid: 'Invalid params found in URL for get tags request',
        noAppId: 'No app found with the provided App Id',
        error: 'Error while getting tags from the server',
      },
    },
    config: {
      upload: {
        paramsInvalid: 'Invalid params found in URL for upload config request',
        noAppId: 'No app found with the provided App ID',
        error: 'Error while uploading configs to the server',
      },
    },
  },
  script: {
    get: {
      paramsInvalid: 'Invalid params found in URL for get scripts request',
      noAppId: 'No app found with the provided App Id',
      error: 'Error while getting scripts from the server',
    },
    upload: {
      paramsInvalid: 'Invalid params found in URL for upload script request',
      noAppId: 'No app found with the provided App ID',
      scriptExists: 'A script with the same name has already been uploaded for this app',
      error: 'Error encountered while uploading script',
    },
    delete: {
      paramsInvalid: 'Invalid params found in URL for delete script request',
      noAppId: 'No app found with the provided App ID',
      scriptInUse: 'Script is being used by an action',
      error: 'Error encountered while deleting script',
    },
  },
  action: {
    get: {
      paramsInvalid: 'Invalid params found in URL for get actions request',
      noAppId: 'No app found with the provided App Id',
      error: 'Error while getting actions from the server',
    },
    create: {
      paramsInvalid: 'Invalid params found in URL for create action request',
      bodyInvalid: 'Invalid properties found in create action request',
      actionExists: 'Action already exists',
      noAppId: 'No app found with the provided App ID',
      noScript: 'The provided script does not exist for this app',
      error: 'Error encountered while creating action',
    },
    update: {
      paramsInvalid: 'Invalid params found in URL for update action request',
      bodyInvalid: 'Invalid properties found in update action request',
      noAppId: 'No app found with the provided App ID',
      noActionId: 'No action found with the provided Action ID',
      noScript: 'The provided script does not exist for this app',
      error: 'Error encountered while updating action',
    },
    delete: {
      paramsInvalid: 'Invalid params found in URL for delete action request',
      noAppId: 'No app found with the provided App ID',
      noActionId: 'No action found with the provided Action ID',
      error: 'Error encountered while deleting action',
    },
    move: {
      paramsInvalid: 'Invalid params found in URL for move action request',
      bodyInvalid: 'Invalid properties found in move action request',
      noAppId: 'No app found with the provided App ID',
      noActionId: 'No action found with the provided Action ID',
      error: 'Error encountered while moving action',
    },
    trigger: {
      get: {
        paramsInvalid: 'Invalid params found in URL for get triggers request',
        noAppId: 'No app found with the provided App ID',
        error: 'Error encountered while getting triggers',
      },
      set: {
        paramsInvalid: 'Invalid params found in URL for set triggers request',
        bodyInvalid: 'Invalid params found in URL for set trigger request',
        noAppId: 'No app found with the provided App ID',
        error: 'Error encountered while setting trigger',
      },
    },
  },
  environment: {
    get: {
      bodyInvalid: 'Invalid properties found in get environment request',
      error: 'Error encountered while getting all environment',
    },
    create: {
      error: 'Error encountered while creating new environment',
      bodyInvalid: 'Invalid properties found in create environment request',
      nameExists: 'A environment with the same name has already been created',
      limit: 'Maximum limit reached',
    },
    update: {
      noAccess: 'Insufficient access while updating environment',
      bodyInvalid: 'Invalid properties found in update environment request',
      error: 'Error encountered while updating environment',
    },
    delete: {
      noAccess: 'Insufficient access while deleting environment',
      error: 'Error encountered while deleting environment',
    },
  },
  global: {
    checkUnique: {
      paramsInvalid: 'Invalid parameters found in create parameter URL',
      error: 'Error encountered while checking uniqueness',
    },
    commands: {
      get: {
        error: 'Error encountered while getting commands',
      },
    },
    datatypes: {
      get: {
        error: 'Error encountered while getting datatypes',
      },
    },
    parameterTypes: {
      get: {
        error: 'Error encountered while getting parameter types',
      },
    },
    reportTypes: {
      get: {
        error: 'Error encountered while getting rpeport types',
      },
    },
    info: {
      get: {
        error: 'There was an error while getting App Studio OpenX info from the server',
      },
    },
    setting: {
      get: {
        error: 'Error encountered while getting global setting',
      },
      update: {
        projectInvalid: 'Invalid tableau project name configured',
        error: 'Error encounted while updating the global setting',
        bodyInvalid: 'Invalid properties found in update global setting request',
      },
      delete: {
        error: 'Error encounted while deleting the domain',
      },
    },
  },
  parameter: {
    get: {
      paramsInvalid: 'Invalid params found in create parameter group URL',
      noAppId: 'No app found with the provided ID',
      error: 'There was an error while creating the parameter group',
    },
    create: {
      paramsInvalid: 'Invalid params found in create parameter URL',
      queryInvalid: 'Invalid query found in create parameter URL',
      bodyInvalid: 'Invalid properties found in create parameter request',
      noAppId: 'No app found with the provided app ID',
      noParameterGroupId: 'No parameter group found with the provided prameter group ID',
      nameExists: 'A parameter with the same name has already been created for this parameter group',
      typeInvalid: 'Parameter type is invalid',
      error: 'There was an error while creating the parameter',
    },
    update: {
      paramsInvalid: 'Invalid params found in update parameter URL',
      bodyInvalid: 'Invalid properties found in update parameter request',
      noAppId: 'No app found with the provided ID',
      noParameterGroupId: 'No parameter group found with the provided parameter group ID',
      parameterDoesNotExist: 'No parameter exists with the provided parameter ID',
      nameExists: 'A parameter with the same name already exists within this parameter group',
      typeInvalid: 'Parameter type is invalid',
      error: 'There was an error while updating the parameter',
    },
    delete: {
      paramsInvalid: 'Invalid params found in delete parameters URL',
      bodyInvalid: 'Invalid properties found in delete parameters request',
      noAppId: 'No app found with the provided ID',
      error: 'There was an error while deleting the parameters',
    },
    move: {
      paramsInvalid: 'Invalid params found in move parameters request URL',
      bodyInvalid: 'Invalid properties found in move parameters request',
      noAppId: 'No app found with the provided ID',
      noParameterGroupId: 'No parameter group found with the provided parameter group ID',
      nameExists: 'One or parameters with the same name already exist in the target group',
      error: 'There was an error while moving parameters',
    },
    group: {
      create: {
        paramsInvalid: 'Invalid params found in create parameter group URL',
        bodyInvalid: 'Invalid properties found in create parameter group request',
        noAppId: 'No app found with the provided ID',
        nameExists: 'A parameter group with the same name has already been created for this app',
        error: 'There was an error while creating the parameter group',
      },
      update: {
        paramsInvalid: 'Invalid params found in update parameter group URL',
        bodyInvalid: 'Invalid properties found in update parameter group request',
        noAppId: 'No app found with the provided ID',
        noParameterGroup: 'No parameter group exists with the provided parameter group ID',
        isDefault: 'Default parameter group cannot be updated',
        nameExists: 'A parameter group with the same name already exists for this app',
        error: 'There was an error while updating the parameter group',
      },
      delete: {
        paramsInvalid: 'Invalid params found in delete parameter groups URL',
        queryInvalid: 'Invalid query found in update parameter group request',
        noAppId: 'No app found with the provided ID',
        noParameterGroup: 'No parameter group exists with the provided parameter group ID',
        isDefault: 'Default parameter group cannot be deleted',
        error: 'There was an error while delete the parameter group',
      },
      move: {
        paramsInvalid: 'Invalid params found in move parameter group URL',
        bodyInvalid: 'Invalid properties found in move parameter group request',
        noAppId: 'No app found with the provided ID',
        noParameterGroup: 'No parameter group exists with the provided parameter group ID',
        isDefault: 'Default parameter group cannot be moved',
        error: 'There was an error while updating the parameter group',
      },
    },
  },
  report: {
    get: {
      paramsInvalid: 'Invalid params found in get reports request URL',
      noAppId: 'No application found with the provided ID',
      error: 'There was an error while getting reports',
    },
    create: {
      paramsInvalid: 'Invalid params found in get reports request URL',
      bodyInvalid: 'Invalid properties found in create report request',
      noAppId: 'No application found with the provided ID',
      reportExists: 'A report already exists for this application',
      error: 'There was an error while creating report',
    },
    update: {
      paramsInvalid: 'Invalid params found in get reports request URL',
      bodyInvalid: 'Invalid properties found in update report request',
      noAppId: 'No application found with the provided ID',
      noReportId: 'No report exists with the provided ID',
      error: 'There was an error while updating report',
    },
    delete: {
      paramsInvalid: 'Invalid params found in get reports request URL',
      noAppId: 'No application found with the provided ID',
      error: 'There was an error while deleting report',
    },
    logs: {
      paramsInvalid: 'Invalid params found in get report logs request URL',
      noAppId: 'No application found with the provided ID',
      noReportId: 'No report exists with the provided ID',
      notShiny: 'The provided report is not a shiny report',
      error: 'There was an error while getting report logs',
    },
  },
  schedule: {
    get: {
      paramsInvalid: 'Invalid params found in get schedule request URL',
      noAppId: 'No application found with the provided ID',
      error: 'There was an error while getting schedules',
    },
    create: {
      paramsInvalid: 'Invalid params found in create schedule request URL',
      bodyInvalid: 'Invalid properties found in create schedule request',
      noAppId: 'No application found with the provided ID',
      scheduleExists: 'A schedule with this name already exists for this application',
      error: 'There was an error while creating schedule',
    },
    update: {
      paramsInvalid: 'Invalid params found in update schedule request URL',
      bodyInvalid: 'Invalid properties found in update schedule request',
      noAppId: 'No application found with the provided ID',
      noScheduleId: 'No schedule exists with the provided ID',
      error: 'There was an error while updating schedule',
    },
    delete: {
      paramsInvalid: 'Invalid params found in update schedule request URL',
      noAppId: 'No application found with the provided ID',
      noScheduleId: 'No schedule exists with the provided ID',
      error: 'There was an error while deleting schedule',
    },
  },
  table: {
    get: {
      paramsInvalid: 'Invalid path parameters found in get tables URL',
      queryInvalid: 'Invalid query parameters found in get tables URL',
      noAppId: 'No app found with the provided ID',
      error: 'There was an error while getting tables for this app from the server',
    },
    create: {
      paramsInvalid: 'Invalid params found in create table URL',
      noAppId: 'No app found with the provided ID',
      tableExists: 'A table with the same name has already been created for this app',
      invalidTag: 'No table tag exists with the provided name and class',
      columnNameInvalid: 'Column names cannot be numeric. Column name %s is not permitted',
      error: 'There was an error while creating the table',
    },
    update: {
      paramsInvalid: 'Invalid params found in update table URL',
      noAppId: 'No app found with the provided ID',
      tableDoesNotExist: 'No table exists with the provided table ID',
      tableExists: 'A table with the same name has already been created for this app',
      invalidTag: 'No table tag exists with the provided name and class',
      error: 'There was an error while updating the table',
    },
    delete: {
      paramsInvalid: 'Invalid params found in delete table url',
      noAppId: 'No app found with the provided ID',
      tableDoesNotExist: 'No table exists with the provided table ID',
      error: 'There was an error while deleting the table',
    },
    move: {
      paramsInvalid: 'Invalid params found in move table url',
      bodyInvalid: 'Invalid properties found in move table request',
      noAppId: 'No app found with the provided ID',
      tableDoesNotExist: 'No table exists with the provided table ID',
      error: 'There was an error while moving the table',
    },
    column: {
      get: {
        paramsInvalid: 'Invalid params found in get columns URL',
        noAppId: 'No app found with the provided ID',
        noTableId: 'No table found with the provided ID',
        error: 'There was an error while getting columns for this table',
      },
      create: {
        paramsInvalid: 'Invalid params found in create column URL',
        bodyInvalid: 'Invalid properties found in create column request',
        noTableId: 'No table found with the provided ID',
        columnExists: 'A column with the same name has already been created for this table',
        invalidDatatype: 'Column datatype is invalid',
        error: 'There was an error while creating the column',
      },
      update: {
        paramsInvalid: 'Invalid params found in update column URL',
        bodyInvalid: 'Invalid properties found in update column request',
        noTableId: 'No table found with the provided ID',
        columnDoesNotExist: 'No column exists with the provided ID',
        invalidDatatype: 'Column datatype is invalid',
        invalidFiltersCount: 'Only 3 quick filters can be shown. Please unselect one filter to proceed',
        error: 'There was an error while updating the column',
      },
      delete: {
        paramsInvalid: 'Invalid params found in delete column URL',
        noTableId: 'No table found with the provided ID',
        columnDoesNotExist: 'No column exists with the provided ID',
        error: 'There was an error while deleting the column',
      },
      move: {
        paramsInvalid: 'Invalid params found in move column URL',
        bodyInvalid: 'Invalid properties found in move column request',
        noTableId: 'No table found with the provided ID',
        columnDoesNotExist: 'No column exists with the provided ID',
        error: 'There was an error while moving the column',
      },
    },
  },
  theme: {
    get: {
      error: 'There was an error while getting themes',
    },
    create: {
      bodyInvalid: 'Invalid properties found in create theme request',
      noImage: 'One or more of the specified images for the theme has not been uploaded',
      parseError: 'There was an error while reading the contents of the uploaded image archive',
      error: 'There was an error while creating the theme',
    },
    update: {
      bodyInvalid: 'Invalid properties found in create theme request',
      noThemeId: 'No theme exists with the provided Theme Id',
      error: 'There was an error while updating the theme',
    },
    delete: {
      noThemeId: 'No theme exists with the provided Theme Id',
      themeUsed: 'The theme to be deleted is being used by one or more applications',
      error: 'There was an error while deleting the theme',
    },
    image: {
      get: {
        typeInvalid: 'Invalid theme image type provided',
        noThemeId: 'No theme exists with the provided Theme Id',
        notOwner: 'User unauthorized to access theme image',
        error: 'There was an error while getting theme image',
      },
      update: {
        typeInvalid: 'Invalid theme image type provided',
        noThemeId: 'No theme exists with the provided Theme Id',
        notOwner: 'User unauthorized to access theme image',
        error: 'There was an error while updating theme image',
      },
    },
  },
  user: {
    update: {
      success: 'User updated successfully',
    },
    delete: {
      error: 'Error deleting user',
      success: 'User deleted successfully',
    },
    defaultQuery: {
      first: 1, max: 10, search: '',
    },
  },
  share: {
    create: {
      success: 'Successfully shared access to application',
    },
    update: {
      success: 'Successfully updated access to application',
    },
    delete: {
      success: 'Successfully removed user from application',
    },
  },
  deployment: {
    deploy: {
      paramsInvalid: 'Invalid params found in deploy URL',
      typeInvalid: 'Deploy Type is not valid',
      inProgress: 'Deployment is already in progress for this app',
      noAppId: 'No application found with the provided ID',
      error: 'There was an error while deploying app',
    },
    stop: {
      inProgress: 'Deployment is already in progress for this app',
      noAppId: 'No application found with the provided ID',
      error: 'There was an error while stopping app',
    },
    shiny: {
      noAppId: 'No application found with the provided ID',
      error: 'There was an error while deploying shiny report',
    },
  },
  defaultProperties: {
    customTheme: {
      group: 'Custom Themes',
      colorScheme: {
        complimentaryColor: '#ffc300',
      },
    },
    defaultGroup: {
      name: 'Group',
      isCollapsed: false,
      position: 0,
    },
    application: {
      isPrivate: false,
      database: {
        serverName: 'platformStore',
        port: 5432,
        username: 'opexapp',
        password: 'this&iswa%first1',
        isExisting: false,
      },
      segments: {
        inputs: {
          name: 'Input Data',
          isDefault: true,
          isVisible: true,
          order: 0,
        },
        parameters: {
          name: 'Parameters',
          isDefault: false,
          isVisible: true,
          order: 1,
        },
        outputs: {
          name: 'Output Data',
          isDefault: false,
          isVisible: true,
          order: 2,
        },
      },
    },
    column: {
      datatype: 'text',
      isVisible: true,
      isEditable: true,
      hasFilter: false,
    },
    table: {
      isVisible: true,
      tag: {
        name: 'untagged',
        class: 'tag-none',
      },
    },
  },
  file: {
    createDirectoryError: 'Error while creating directory',
    csvConversion: 'Error converting the uploaded file to csv',
    extractError: 'Error extracting the uploaded zip file',
    invalidPathError: 'The path to save the file at is invalid',
    saveError: 'Error saving the uploaded file to app folder',
    writeError: 'Error writing file',
    readError: 'Error reading file',
    parseNameError: 'Error parsing name ',
  },
  parser: {
    parseMultipartError: 'Error parsing multipart form data',
    parseMultipartJsonError: 'Error parsing json value in multipart form data',
    parseFolderError: 'Error parsing uploaded folder archive',
  },
  fs: {
    paths: {
      configs: '/src/configs',
      appRoot: '/analytics_center',
      enframeRoot: '/src',
      dbDump: '/database/scenariodata.dump',
    },
    directories: {
      app: {
        input: 'input',
        output: 'output',
        scripts: 'ds',
        config: 'config',
        database: 'database',
        shiny: 'shinyr',
      },
      enframe: {
        images: {
          theme: 'assets/images/theme',
          theme_bg: 'public/dist/theme',
        },
      },
    },
    filenames: {
      applicationConfig: 'ApplicationConfig.json',
    },
  },
  string: {
    defaultScriptName: 'execute',
    defaultEnvironment: 'python-executor:3.8.1',
    postgresRoles: {
      dba: 'dba',
      readWrite: 'rw',
      readOnly: 'ro',
      adhoc: 'adhoc',
    },
    application: {
      status: {
        inProgress: 'IN-PROGRESS',
        activating: 'ACTIVATING',
        active: 'ACTIVE',
        deactivating: 'DEACTIVATING',
        inactive: 'INACTIVE',
        upgrading: 'UPGRADING',
        deleted: 'DELETED',
      },
      type: {
        acApp: 'acApp',
      },
    },
    deployment: {
      status: {
        queued: 'QUEUED',
        success: ['SUCCESS'],
        failure: ['FAILURE', 'ABORTED', 'UNSTABLE'],
        deploying: 'DEPLOYING',
      },
      stages: {
        deployment: 'deployment',
        publishReports: 'publishReports',
      },
      type: {
        restart: 'restart',
        stop: 'stop',
        deploy: 'deploy',
        restore: 'restore',
        upgrade: 'upgrade',
        shiny: 'shiny',
      },
    },
    environment: {
      status: {
        queued: 'QUEUED',
        success: 'SUCCESS',
        failure: 'FAILURE',
        installing: 'INSTALLING',
      },
      type: {
        create: 'create environment',
        update: 'update environment',
      },
    },
  },
  collection: {
    names: {
      action: 'actions',
      application: 'applications',
      configuration: 'configurations',
      parameterGroup: 'parameterGroups',
      parameter: 'parameters',
      report: 'reports',
      schedule: 'schedules',
      setting: 'settings',
      table: 'tables',
      template: 'templates',
      trigger: 'triggers',
      theme: 'themes',
      environment: 'environments',
    },
  },
  datatypeMap: {
    Boolean: 'boolean',
    Date: 'timestamp',
    Number: 'numeric',
    String: 'text',
  },
  appFolderMap: {
    inputs: 'input',
    outputs: 'output',
    scripts: 'ds',
    config: 'config',
    database: 'database',
    shinyr: 'shinyr',
    reports: 'reports',
  },
  types: {
    appFormat: {
      normal: 'normal',
      ticdat: 'ticdat',
    },
    action: {
      primary: 'primary',
      secondary: 'secondary',
      upload: 'upload',
      download: 'download',
    },
    trigger: {
      tableUpload: 'tableUpload',
      tableEdit: 'tableEdit',
      scenarioCreation: 'scenarioCreation',
    },
    environment: {
      default: 'default',
      custom: 'custom',
      all: 'all',
      internal: 'internal',
    },
    instance: {
      default: 'default',
      small: 'small',
      medium: 'medium',
      large: 'large',
      xlarge: 'xlarge',
    },
    schedule: {
      once: 'once',
      daily: 'daily',
      weekly: 'weekly',
      custom: 'custom',
    },
    themeImage: [
      'background',
      'logo',
      'icon',
    ],
    report: {
      default: 'default',
      shiny: 'shiny',
    },
    config: [
      'InputTableConfig.json',
      'OutputTableConfig.json',
      'EditTableConfig.json',
      'ParameterOptionsConfig.json',
      'TableConfig.json',
      'ParameterConfig.json',
      'MacrosConfig.json',
      'TemplateConfig.json',
      'TableauConfig.json',
      'ViewConfig.json',
      'RowWidgetConfig.json',
    ],
    upload: {
      directory: {
        app: 0,
        scripts: 1,
      },
    },
    table: [
      'input',
      'output',
    ],
    file: {
      input: [
        '.xlsx',
        '.csv',
      ],
    },
    tagClasses: {
      'tag-red': '#E74E4E',
      'tag-orange': '#E46C0B',
      'tag-yellow': '#FBAF5D',
      'tag-green': '#00A79D',
      'tag-blue': '#558ED5',
      'tag-violet': '#410E77',
      'tag-purple': '#B02578',
      'tag-pink': '#FB4FC9',
      'tag-none': '#AAAAAA',
    },
    template: {
      command: 'command',
      datatype: 'datatype',
      parameterType: 'parameterType',
      reportType: 'reportType',
    },
  },
  airflow: {
    connections: {
      tableau: 'tableau',
      powerbi: 'powerbi',
      connectionType: 'http',
    },
  },
};

module.exports = constants;
