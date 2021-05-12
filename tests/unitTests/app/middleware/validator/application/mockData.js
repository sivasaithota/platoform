const mongoClient = require('../../.../../../../../../app/dataServices/mongoClient');

const mockData = {
  responseObj: {
    status:(code) => {
      return mockData.responseObj;
    },
    send: (result) => {
    },
  },
  reqObj: {
    createApplicationInvalidName: {
      body: { name: 'test@12' },
    },
    createApplicationValidName: {
      body: { name: 'test12' },
    },
    deleteApplicationValid: {
      params: {
        appId: '123456789012345678901234',
      },
    },
    deleteApplicationInValid: {
      params: {
        appId: '1234567890123456789-12',
      },
    },
    getApplicationValid: {
      params: {
        appId: '123456789012345678901234',
      },
    },
    getApplicationInvalid: {
      params: {
        appId: '1234567890123456789-12',
      },
    },
    updateApplicationValid: {
      params: {
        appId: '123456789012345678901234',
      },
      body: {
        url: 'test/',
      },
    },
    updateApplicationInvalid: {
      params: {
        appId: '1234567890123456789-234',
      },
      body: {},
    },
    getTagsValid: {
      params: {
        appId: '123456789012345678901234',
      },
    },
    getTagsInvalid: {
      params: {
        appId: '1234567890123456789-12',
      },
    },
    getScriptsValid: {
      params: {
        appId: '123456789012345678901234',
      },
    },
    getScriptsInvalid: {
      params: {
        appId: '12345678901234567891234',
      },
    },
    uploadScriptValid: {
      params: {
        appId: '123456789012345678901234',
      },
      body: {
        fileData: { name: 'test' },
      },
    },
    uploadScriptInvalid: {
      params: {
        appId: '12345678901234567891234',
      },
    },
    deleteScriptValid: {
      params: {
        appId: '123456789012345678901234',
      },
    },
    getActionValid: {
      params: {
        appId: '123456789012345678901234',
      },
    },
    getActionInvalid: {
      params: {
        appId: '12345678901234567891234',
      },
    },
    createActionValid: {
      params: {
        appId: '123456789012345678901234',
      },
      body: {
        fileName: 'test',
        command: 'python',
        version: 'v3',
      },
    },
    updateActionValid: {
      params: {
        appId: '123456789012345678901234',
      },
      body: {
        fileName: 'test',
        command: 'python',
        version: 'v3',
      },
    },
    createActionInvalid: {
      params: {
        appId: '12345678901234567891234',
      },
    },
    updateActionInvalid: {
      params: {
        appId: '12345678901234567891234',
      },
    },
    validateActionRequestBody: {
      InvalidFilename: {
        body: {
          fileName: '',
        },
      },
      InvalidCommand: {
        body: {
          fileName: 'tets',
          command: 12,
        },
      },
      InvalidVersion: {
        body: {
          fileName: 'test',
          command: 'python',
          version: 12,
        },
      },
    },
    updateActionExists: {
      params: {
        appId: '123456789012345678901234',
        actionId: '123456789012345678901234',
      },
    },
  },
  applicationDataServiceResult: {
    getAppByNameExists: {
      name: 'test12',
    },
    documentApplicationId: {
      appId: mongoClient.getObjectId('123456789012345678901234'),
    },
    applicationId: {
      _id: mongoClient.getObjectId('123456789012345678901234'),
    },
    updateApplicationUrlExist: {
      _id: mongoClient.getObjectId('123456789012345678911234'),
    },
  },
  mongoClientResult: {
    createAction: {
      collection: [
        {
          versions: [
            'v2',
            'v3',
          ],
        },
      ],
    },
    updateActionExists: {
      appId: mongoClient.getObjectId('123456789012345678901234'),
    },
  },
};

module.exports = mockData;
