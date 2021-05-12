const mongoClient = require('../../../../../app/dataServices/mongoClient');
const constants = require('../../../../../app/common/constants');

module.exports = {
  appId: '123456789012345678901234',
  url: 'test/',
  fileName: 'test',
  appName: 'test',
  tagName: 'test',
  parameter: {
    getApplications: [{
      limit: 2,
      skip: 2,
      sortDirection: -1,
      filter: 'test',
      sortBy: 'date',
    },
    {
      limit: 2,
      skip: 2,
      sortDirection: 'desc',
      filter: 'test',
    },
    ],
    createApplication: {
      name: 'Test',
      description: '',
      type: 'acApp',
      status: 'IN-PROGRESS',
      username: 'test',
      createdAt: new Date(),
      login:
      {
        id: 'Administrator',
        email: 'demo@opexanalytics.com',
        password: '8b27af885ca59da730d60bdb2c24fee4',
      },
    },
    getApplication: {
      _id: '123456789012345678901234',
    },
    createTags: {
      name: 'test',
      appId: '123456789012345678901234',
      color: 'red',
      createdBy: 'test',
      createdAt: '21/03/2019',
    },
    createActions: {
      appId: '123456789012345678901234',
      fileName: 'test',
      username: 'test',
      command: 'install',
      version: '19.06.01',
      createdBy: 'test',
      createdAt: '2019.06.17',
    },
    updateAction: {
      paramobject: {
        actionId: '123456789012345678901234',
      },
      actionObject: {
        fileName: 'test',
        username: 'test',
        command: 'install',
        version: '19.06.01',
        updatedAt: '2019.06.17',
      },
    },
    getTag: {
      name: 'test',
      class: ['test'],
    },
    updateApplication: {
      username: 'test',
      url: 'test',
      createdAt: '21/03/2019',
      updatedAt: '21/05/2019',
      type: 'acApp',
      status: 'IN-PROGRESS',
    },
  },
  result: {
    findOne: {
      _id: '123456789012345678901234',
    },
    getApplications: {
      _id: '123456789012345678901234',
      name: 'test',
      type: 'normal',
      url: '/test',
      status: 200,
      createdBy: 'manasi',
      createdAt: '21/03/2019',
      version: '21.03.2019.1',
    },
    createApplication: {
      inserted_id: '123456789012345678901234',
    },
    deleteAllApplicationData: [
      [constants.collection.names.action, { appId: mongoClient.getObjectId('123456789012345678901234') }],
      [constants.collection.names.application, { _id: mongoClient.getObjectId('123456789012345678901234') }],
      [constants.collection.names.configuration, { _id: mongoClient.getObjectId('123456789012345678901234') }],
      [constants.collection.names.parameter, { appId: mongoClient.getObjectId('123456789012345678901234') }],
      [constants.collection.names.parameterGroup, { appId: mongoClient.getObjectId('123456789012345678901234') }],
      [constants.collection.names.table, { appId: mongoClient.getObjectId('123456789012345678901234') }],
      [constants.collection.names.report, { appId: mongoClient.getObjectId('123456789012345678901234') }],
    ],
    getApplication: {
      name: 'test',
      displayName: 'Test-1',
    },
    getTags: [
      'test',
      'sample',
    ],
    getScripts: [
      'test',
      'sample',
    ],
    getActions: [
      12,
      'hello',
      'test',
      '19.6.01',
    ],
    createActions: {
      inserted_id: 1,
    },
    updateOne: {
      result: {
        nModified: 10,
      },
    },
  },
  projection: {
    getApplications: {
      _id: 1,
      name: 1,
      url: 1,
      status: 1,
      createdBy: 1,
      createdAt: 1,
      updatedAt: 1,
      version: 1,
    },
    getApplication: {
      name: 1,
      displayName: 1,
      description: 1,
      url: 1,
      login: 1,
      database: 1,
      createdBy: 1,
      report: 1,
      segments: 1,
      themeId: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
    },
    getScripts: {
      scripts: 1,
    },
    getActions: {
      _id: 1, command: 1, fileName: 1, version: 1,
    },
  },
  query: {
    getApplications: {
      status: { $ne: 'DELETED' },
    },
    createActions: {
      appId: mongoClient.getObjectId('123456789012345678901234'),
      fileName: 'test',
      command: 'install',
      version: '19.06.01',
      createdBy: 'test',
      createdAt: '2019.06.17',
      updatedBy: 'test',
      updatedAt: '2019.06.17',
    },
    applicationId: {
      _id: mongoClient.getObjectId('123456789012345678901234'),
    },
    getTagByName: {
      appId: mongoClient.getObjectId('123456789012345678901234'),
      name: 'test',
    },
    getTag: {
      name: 'test',
      class: ['test'],
      appId: mongoClient.getObjectId('123456789012345678901234'),
    },
    getActionAppIdByFileName: {
      appId: mongoClient.getObjectId('123456789012345678901234'),
      fileName: 'test',
    },
  },
  update: {
    updateAction: {
      fileName: 'test',
      command: 'install',
      version: '19.06.01',
      updatedBy: 'test',
      updatedAt: '2019.06.17',
    },
    addScript: {
      $push: {
        scripts: 'test',
      },
    },
    deleteScript: {
      $pull: {
        scripts: 'test',
      },
    },
    updateApplication: {
      $set: {
        username: 'test',
        url: 'test',
        createdAt: '21/03/2019',
        updatedAt: '21/05/2019',
        type: 'acApp',
        status: 'IN-PROGRESS',
      },
    },
  },
  sort: {
    getApplications: { date: -1 },
  },
  databaseQuery: {
    deleteApplicationDatabase: 'DROP DATABASE IF EXISTS test',
  },
  properties: {
    createApplication:
    ['name', 'displayName', 'description', 'type', 'status', 'themeId', 'login', 'database', 'segments', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'],
  },
};
