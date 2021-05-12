const constants = require('../../../../../app/common/constants');
const mongoClient = require('../../../../../app/dataServices/mongoClient');

const mockData = {
  responseObj: {
    status: (code) => {
      return mockData.responseObj;
    },
    send: (result) => {
    },
  },
  resultMongoClient: {
    getApplications: {
      _id: 1,
      name: 'test',
      type: 'test',
      url: 't',
      status: '1',
    },
    createApplication: {
      insertedId: 1,
    },
    getApplication: {
      name: 'test',
      displayName: 'Test-1',
      login: {
        password: '11111111',
      },
    },
    getApplicationData: {
      status: 'active',
      database: {
        servername: 'log-store',
        port: 5432,
        databaseName: 'test',
        username: 'test',
        password: '123',
      },
    },
    getTags: [
      'test',
      'sample',
    ],
    getScripts: {
      scripts: [
        'test',
        'sample',
      ],
    },
    getAction: [
      12,
      'hello',
      'test',
      '19.6.01',
    ],
    createAction: {
      insertedId: 1,
    },
    updateAction: {
      result: {
        nModified: 10,
      },
    },
    updateApplication: {
      result: {
        nModified: 10,
      },
    },
    deleteScript: {
      result: {
        nModified: 10,
      },
    },
    uploadScript: {
      result: {
        nModified: 10,
      },
    },
  },
  mongoparameter: {
    getApplications: [
      constants.collection.names.application,
      {
        displayName: /test/i,
        status: {
          $ne: 'DELETED',
        },
      },
      {
        _id: 1,
        name: 1,
        url: 1,
        status: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
        version: 1,
      },
      { date: -1 },
      2,
      2,
    ],
    createApplication: [
      constants.collection.names.application,
      {
        name: 'Test',
        displayName: 'Test',
        description: '',
        type: 'acApp',
        status: 'IN-PROGRESS',
        createdBy: 'test',
        updatedBy: 'test',
        url: 'test',
        refTables: [],
        refParameterGroups: [],
      },
    ],
    getApplication: [
      constants.collection.names.application,
      {
        _id: mongoClient.getObjectId('123456789012345678901234'),
      },
      {
        name: 1,
        displayName: 1,
        description: 1,
        url: 1,
        database: 1,
        login: 1,
        report: 1,
        segments: 1,
        themeId: 1,
        createdBy: 1,
        createdAt: 1,
        updatedBy: 1,
        updatedAt: 1,
      },
    ],
    getTags: [
      constants.collection.names.table,
      'tag',
      { appId: mongoClient.getObjectId('123456789012345678901234') },
    ],
    getScripts: [
      constants.collection.names.application,
      {
        _id: mongoClient.getObjectId('123456789012345678901234'),
      },
      { scripts: 1 },
    ],
    getActions: [
      constants.collection.names.action,
      {
        appId: mongoClient.getObjectId('123456789012345678901234'),
      },
      {
        _id: 1,
        command: 1,
        fileName: 1,
        version: 1,
      },
    ],
    updateAction: [
      constants.collection.names.action,
      {
        _id: mongoClient.getObjectId('123456789012345678901234'),
      },
    ],
    updateApplication: [
      constants.collection.names.application,
      {
        _id: mongoClient.getObjectId('123456789012345678901234'),
      },
      {
        $set: { updatedBy: 'test' },
      },
    ],
    deleteScript: [
      constants.collection.names.application,
      {
        _id: mongoClient.getObjectId('123456789012345678901234'),
      },
      {
        $pull: { scripts: 'test' },
      },
    ],
    uploadScript: [
      constants.collection.names.application,
      {
        _id: mongoClient.getObjectId('123456789012345678901234'),
      },
      {
        $push: {
          scripts: 'test',
        },
      },
    ],
  },
  parameter: {
    getApplications: {
      query: {
        limit: 2,
        skip: 2,
        sortDirection: 'desc',
        filter: 'test',
        sortBy: 'date',
      },
    },
    createApplication:
    {
      body: {
        name: 'Test',
      },
      user: {
        username: 'test',
      },
    },
    getApplication: {
      params: {
        appId: '123456789012345678901234',
        fileName: 'test',
      },
      user: {
        username: 'test',
      },
    },
    deleteApplication: {
      params: {
        appId: '123456789012345678901234',
      },
      query: {
        withBackup: 'true',
      },
      user: {
        username: 'test',
      },
    },
    getTags: {
      params: {
        appId: '123456789012345678901234',
      },
    },
    getScripts: {
      params: {
        appId: '123456789012345678901234',
      },
    },
    getActions: {
      params: {
        appId: '123456789012345678901234',
      },
    },
    createAction: {
      params: {
        appId: '123456789012345678901234',
      },
      body: {
        appId: '123456789012345678901234',
        fileName: 'test',
        username: 'test',
        command: 'install',
        version: '19.06.01',
        createdBy: 'test',
        createdAt: '2019.06.17',
      },
      user: {
        username: 'test',
      },
    },
    updateAction: {
      params: {
        actionId: '123456789012345678901234',
      },
      body: {
        fileName: 'test',
        command: 'python',
        version: '19.06.01',
        updatedAt: new Date(),
      },
      user: {
        username: 'test',
      },
    },
    updateApplication: {
      params: {
        appId: '123456789012345678901234',
      },
      body: {
      },
      user: {
        username: 'test',
      },
    },
    deleteScript: {
      params: {
        appId: '123456789012345678901234',
        fileName: 'test',
      },
      deleteFile: [
        '/analytics_center/123456789012345678901234/ds/test',
      ],
    },
    uploadScript: {
      params: {
        appId: '123456789012345678901234',
      },
      body: {
        fileData: {
          name: 'test',
          path: '/test',
        },
      },
      copyFileFiler: [
        '/test',
        '/analytics_center/123456789012345678901234/ds/test',
      ],
    },
  },
  properties: {
    createApplication:
    ['name', 'displayName', 'description', 'type', 'status', 'themeId', 'login', 'database', 'segments', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'],
    updateAction:
    ['fileName', 'command', 'version', 'updatedBy', 'updatedAt'],
    updateApplication:
    ['updatedBy', 'updatedAt'],
    createAction:
    [ 'appId', 'fileName', 'command', 'version', 'createdBy', 'createdAt', 'updatedAt', 'updatedBy'],
  },
};

module.exports = mockData;
