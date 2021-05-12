const mongoClient = require('../../../../../app/dataServices/mongoClient');
const constants = require('../../../../../app/common/constants');

const mockData = {
  responseObj: {
    status: (code) => {
      return mockData.responseObj;
    },
    send: (result) => {
    },
  },
  requestobj: {
    moveParameters: {
      params: {
        appId: '123456789012345678901234',
        parameterGroupId: '123456789012345678901111',
      },
      body: {
        parameterMap: {
          '5d1c3073c146b00016d35ced': ['5d1c325adfde190015fe8650'],
        },
        position: 1,
      },
    },
    deleteParameter: {
      body: {
        parameterMap: {
          '5d1c3073c146b00016d35ced': ['5d1c325adfde190015fe8650'],
        },
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
        name: 'parameter',
        isCollapsed: true,
      },
      user: {
        username: 'test',
      },
    },
    updateParameterGroup: {
      params: {
        appId: '123456789012345678901234',
        parameterGroupId: '123456789012345678901234',
      },
      body: {
        name: 'Update parameter',
      },
      user: {
        username: 'test',
      },
    },
    moveParameterGroup: {
      params: {
        appId: '123456789012345678901234',
        parameterGroupId: '123456789012345678911111',
      },
      body: {
        position: 1,
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
    deleteParameterGroup: [
      {
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '123456789012345678901111',
        },
        query: {
          parametersMovedToGroupId: '123456789012345678900000',
        },
      },
      {
        params: {
          appId: '123456789012345678901234',
          parameterGroupId: '123456789012345678901111',
        },
        query: {
          parametersMovedToGroupId: null,
        },
      },
    ],
    updateParameter: {
      params: {
        appId: '123456789012345678901234',
        parameterGroupId: '123456789012345678901111',
        parameterId: '123456789012345678900000',
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
    },
  },
  mongoClientResult: {
    getParameters: [
      {
        _id: '123456789012345678901232',
        name: 'Renamed Parameter Group',
        isCollapsed: true,
        parameterGroupOrder: 1,
        parameters: [],
      },
    ],
    insertOne: {
      insertedId: 1,
    },
    updateOne: {
      result: {
        nModified: 1,
      },
    },
    delete: {
      result: {
        n: 1,
      },
    },
    updateMany: {
      result: {
        nModified: 1,
      },
    },
    findOneAndDelete: {
      value: {
        refParameters: [
          '123456789012345678900001',
        ],
      },
    },
  },
  mongoClientParameter: {
    createParameterGroup: {
      insertOne: [
        constants.collection.names.parameterGroup,
        {
          name: 'parameter',
          appId: mongoClient.getObjectId('123456789012345678901234'),
          isCollapsed: true,
          refParameters: [],
          createdBy: 'test',
          updatedBy: 'test',
        },
      ],
      updateOne: [
        constants.collection.names.application,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        { $push: { refParameterGroups: 1 } },
      ],
    },
    moveParameterGroup: [
      [constants.collection.names.application,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        { $pull: { refParameterGroups: mongoClient.getObjectId('123456789012345678911111') } },
      ],
      [constants.collection.names.application,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        {
          $push: {
            refParameterGroups: {
              $each: [mongoClient.getObjectId('123456789012345678911111')],
              $position: 1,
            },
          },
        },
      ],
    ],
    createParameter: {
      updateOne: [
        constants.collection.names.parameterGroup,
        { _id: mongoClient.getObjectId('123456789012345678901111') },
        {
          $push: {
            refParameters: {
              $each: [1],
              $position: 1,
            },
          },
        },
      ],
    },
    deleteParameterGroup: {
      findOneAndDelete: [
        constants.collection.names.parameterGroup,
        { _id: mongoClient.getObjectId('123456789012345678901111') },
      ],
      deleteOne: [
        constants.collection.names.parameterGroup,
        { _id: mongoClient.getObjectId('123456789012345678901111') },
      ],
      updateOne: {
        application: [
          constants.collection.names.application,
          { _id: mongoClient.getObjectId('123456789012345678901234') },
          { $pull: { refParameterGroups: mongoClient.getObjectId('123456789012345678901111') } },
        ],
        parameter: [
          constants.collection.names.parameterGroup,
          { _id: mongoClient.getObjectId('123456789012345678900000') },
          { $push: { refParameters: { $each: ['123456789012345678900001'] } } },
        ],
      },
      updateMany: [
        constants.collection.names.parameter,
        { _id: { $in: ['123456789012345678900001'] } },
        { $set: { parameterGroupId: mongoClient.getObjectId('123456789012345678900000') } },
      ],
      deleteMany: [
        constants.collection.names.parameter,
        { parameterGroupId: mongoClient.getObjectId('123456789012345678901111') },
      ],
    },
    deleteParameters: {
      deleteMany: [
        constants.collection.names.parameter,
        { _id: { $in: [mongoClient.getObjectId('5d1c325adfde190015fe8650')] } },
      ],
      updateMany: [
        constants.collection.names.parameterGroup,
        { _id: { $in: [mongoClient.getObjectId('5d1c3073c146b00016d35ced')] } },
        { $pull: { refParameters: { $in: [mongoClient.getObjectId('5d1c325adfde190015fe8650')] } } },
      ],
    },
    moveParameters: {
      updateOne: [
        constants.collection.names.parameterGroup,
        { _id: mongoClient.getObjectId('123456789012345678901111') },
        { $push: { refParameters: { $each: [mongoClient.getObjectId('5d1c325adfde190015fe8650')], $position: 1 } } },
      ],
      updateMany: [
        constants.collection.names.parameter,
        { _id: { $in: [mongoClient.getObjectId('5d1c325adfde190015fe8650')] } },
        { $set: { parameterGroupId: mongoClient.getObjectId('123456789012345678901111') } },
      ],
    },
  },
  commonServiceResult: {
    getParameterType: {
      properties:
       [
         {
           name: 'isNumeric',
           displayName: 'Numeric Only',
           type: 'Boolean',
         },
         {
           name: 'defaultValue',
           displayName: 'Default Value',
         },
       ],
    },
  },
  properties: {
    createParameter: [
      ['appId', 'parameterGroupId', 'name', 'type', 'isNumeric', 'defaultValue', 'isRequired', 'tooltip', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt'],
    ],
    updateParameter: [
      ['name', 'type', 'isNumeric', 'defaultValue', 'isRequired', 'tooltip', 'updatedBy', 'specificProperties', 'updatedAt'],
      ['isNumeric', 'defaultValue'],
    ],
  },
};
module.exports = mockData;
