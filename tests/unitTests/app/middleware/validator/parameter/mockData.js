const mongoClient = require('../../../../../../app/dataServices/mongoClient');

const mockData = {
  responseObj: {
    status:(code) => {
      return mockData.responseObj;
    },
    send: (result) => {
    },
  },
  requestObj: {
    validRequest: {
      moveParameter: {
        method: 'PATCH',
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '123456789012345678901111',
          parameterId: '123456789012345678900000',
        },
        body: {
          type: 'inputBox',
          isNumeric: true,
          defaultValue: 1,
          isRequired: true,
          tooltip: 'Just your average tooltip',
        },
        user: {
          username: 'test',
        },
        query: {
          position: 1,
        },
      },
      deleteParameter: {
        params: {
          appId: '123456789012345678901234',
        },
        body: {
          parameterMap: {
            '5d1c3073c146b00016d35ced': ['5d1c325adfde190015fe8650'],
          },
        },
      },
      deleteParameterGroup: {
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '123456789012345678901111',
        },
        query: {
          parametersMovedToGroupId: '123456789012345678900000',
        },
      },
      moveparameterGroup: {
        method: 'PATCH',
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '123456789012345678901111',
        },
        body: {
          position: 1,
        },
        user: {
          username: 'test',
        },
      },
      updateParmeterGroup: {
        method: 'PATCH',
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '123456789012345678901111',
        },
        body: {
          name: 'parameter Group',
        },
        user: {
          username: 'test',
        },
      },
      getParameters: {
        params: {
          appId: '123456789012345678901234',
        },
      },
      createParameterGroup: {
        params: {
          appId: '123456789012345678901234',
        },
        body: {
          name: 'parameter Group',
          isCollapsed: true,
        },
        user: {
          username: 'test',
        },
      },
      createParameter: {
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '123456789012345678901111',
        },
        body: {
          name: 'Input Parameter 1',
          type: 'inputBox',
          isNumeric: true,
          defaultValue: 1,
          isRequired: true,
          tooltip: 'Just your average tooltip',
        },
        user: {
          username: 'test',
        },
        query: {
          position: 1,
        },
      },
      updateParameter: {
        method: 'PATCH',
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '123456789012345678901111',
          parameterId: '123456789012345678900000',
        },
        body: {
          type: 'inputBox',
          isNumeric: true,
          defaultValue: 1,
          isRequired: true,
          tooltip: 'Just your average tooltip',
        },
        user: {
          username: 'test',
        },
        query: {
          position: 1,
        },
      },
    },
    inValidArgment: {
      inValidApplicationId: {
        params: {
          appId: 1,
        },
      },
      inValidParameterMap: {
        body: {
          parameterMap: '5d1c3073c146b00016d35',
        },
      },
      inValidParameterMapParameterGroupId: {
        body: {
          parameterMap: {
            '5d1c3073c146b00016d35': ['5d1c325adfde190015fe8650'],
          },
        },
      },
      inValidParameterMapParameterId: {
        body: {
          parameterMap: {
            '5d1c3073c146b00016d35ced': ['5d1c325adfde190015fe8650', '12'],
          },
        },
      },
      inValidParameterIdArray: {
        body: {
          parameterMap: {
            '5d1c3073c146b00016d35ced': '5d1c325adfde190015fe8650',
          },
        },
      },
      inValidGroupId: {
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '1234567890123456789-1',
        },
      },
      
      inValidParametersMovedToGroupId: {
        query: {
          parametersMovedToGroupId: '1234567890123456789',
        },
      },
      inValidParameterGroupId: {
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '9012345678901111',
        },
      },
      inValidParameterId: {
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '123456789012345678901234',
          parameterId: '11111111111111',
        },
      },
      inValidPosition: {
        body: {
          position: -1,
        },
      },
      inValidName: {
        body: {
          name: 1,
        },
      },
      inValidIsCollapsed: {
        body: {
          name: 'parameter',
        },
      },
      createParameter: [
        {
          body: {
            name: 1,
          },
        },
        {
          body: {
            name: 'test',
            type: 'inputBox',
            isRequired: 1,
          },
        },
        {
          body: {
            name: 'test',
            type: 'inputBox',
            isRequired: true,
            tooltip: 1,
          },
        },
        {
          body: {
            name: 'test',
            type: 1,
          },
        },
      ],
      updateParameter: [
        {
          body: {
            name: 1,
          },
        },
        {
          body: {
            name: 'test',
            type: 'inputBox',
            isRequired: 1,
          },
        },
        {
          body: {
            name: 'test',
            type: 'inputBox',
            isRequired: true,
            tooltip: 1,
          },
        },
        {
          body: {
            name: 'test',
            type: 1,
          },
        },
      ],
      inValidType: {
        body: {
          name: 'Input Parameter 1',
          isNumeric: true,
          isRequired: true,
          tooltip: 'Just your average tooltip',
        },
      },
    },
  },
  applicationDataServiceResult: {
    applicationId: {
      _id: mongoClient.getObjectId('123456789012345678901234'),
    },
  },
  parameterDataServiceResult: {
    appId: {
      appId: mongoClient.getObjectId('123456789012345678901234'),
    },
    applicationId: {
      _id: mongoClient.getObjectId('123456789012345678901234'),
    },
    otherId: {
      _id: mongoClient.getObjectId('123456789012345678901211'),
    },
    parameterGroupId: {
      _id: mongoClient.getObjectId('123456789012345678901111'),
    },
    parameterId: {
      _id: mongoClient.getObjectId('123456789012345678900000'),
    },
  },
};

module.exports = mockData;
