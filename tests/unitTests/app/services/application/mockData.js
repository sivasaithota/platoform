module.exports = {
  getApplications: {
    _id: 1,
    name: 'test',
    type: 'test',
    url: 't',
    status: '1',
  },
  query: {
    limit: 2,
    skip: 2,
    sortDirection: 'desc',
    filter: 'test',
    sortBy: 'date',
  },
  userObject: {
    username: 'test',
  },
  appObject: [
    {
      name: 'Test',
      login: {
        id: 'Administrator',
        password: 'password123',
      },
      segments: {
        inputs: {
          name: 'Input Data',
          isVisible: true,
          isDefault: true,
        },
      },
    },
    { name: 'Test', folderData: { } },
  ],
  paramsObject: {
    appId: 1,
    fileName: 'test',
  },
  result: {
    getApplications: [
      {
        limit: 2,
        skip: 2,
        sortDirection: -1,
        filter: 'test',
        sortBy: 'date',
        filterBy: 'displayName',
      },
      {
        limit: 0, skip: 0, sortDirection: 1, filterBy: 'displayName',
      },
    ],
    getApplication: {
      name: 'test',
      displayName: 'Test-1',
      login: {
        password: '11111111',
      },
    },
    getApplicationData: [
      {
        status: 'ACTIVE',
        database: {
          servername: 'log-store',
          port: 5432,
          databaseName: 'test',
          username: 'test',
          password: '123',
        },
      },
      {
        status: 'IN-PROGRESS',
        database: {
          servername: 'log-store',
          port: 5432,
          databaseName: 'test',
          username: 'test',
          password: '123',
        },
      },
    ],
    getTag: {
      _id: 1,
      name: 'test',
      color: 'red',
    },
    createApplication: {
      insertedId: '123456789012345678901234',
    },
    getScripts: {
      scripts: ['test'],
    },
    updateOne: {
      result: {
        nModified: 1,
      },
    },
    getActions: [
      12,
      'hello',
      'test',
      '19.6.01',
    ],
    createAction: {
      insertedId: 1,
    },
  },
  actionObject: {
    username: 'test',
    appId: 1,
    createdAt: 0,
  },
  tagObject: {
  },
  fileObject: {
    fileData: {
      name: 'test',
      path: 'test/test1',
    },
  },
  fileSavePath: 'save/test2',
  parameter: {
    createAction: {
      username: 'test',
      appId: 1,
    },
    updateAction: {
      appId: 1,
      fileName: 'test',
    },
  },
  properties: {
    createApplication:
    [
      ['name', 'description', 'type', 'status', 'username', 'createdAt', 'login', 'themeId', 'segments', 'updatedAt', 'updatedBy'],
      ['id', 'email', 'password'],
    ],
    createAction: ['username', 'appId', 'createdAt', 'updatedAt', 'updatedBy'],
    updateApplication: ['name', 'updatedBy', 'updatedAt', 'segments.inputs.name', 'segments.inputs.isVisible', 'segments.inputs.isDefault', 'segments.parameters.isDefault', 'segments.outputs.isDefault', 'login.id', 'login.password'],
  },
};
