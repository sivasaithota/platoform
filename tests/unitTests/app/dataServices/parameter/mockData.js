const mongoClient = require('../../../../../app/dataServices/mongoClient');
const constants = require('../../../../../app/common/constants');

module.exports = {
  moveParmeter: {
    parameterMap: {
      '5d1c3073c146b00016d35ced': ['5d1c325adfde190015fe8650'],
    },
    position: 1,
  },
  parameterMap: {
    '5d1c3073c146b00016d35ced': ['5d1c325adfde190015fe8650'],
  },
  idObject: {
    appId: '123456789012345678901234',
    parameterGroupId: '123456789012345678901111',
    parameterId: '123456789012345678900000',
  },
  position: 1,
  parameterObject: {
    createParameter: {
      name: 'Input Parameter 1',
      type: 'inputBox',
      isNumeric: true,
      defaultValue: 1,
      isRequired: true,
      tooltip: 'Just your average tooltip',
      username: 'test',
      specificProperties: { isNumeric: true, defaultValue: 1 },
      createdAt: new Date(),
    },
    updateParameter: {
      name: 'Input Parameter 1',
      type: 'inputBox',
      isNumeric: true,
      defaultValue: 1,
      isRequired: true,
      tooltip: 'Just your average tooltip',
      updatedBy: 'test',
      specificProperties: { isNumeric: true, defaultValue: 1 },
      updatedAt: new Date(),
    }
  },
  movedToGroupId: '123456789012345678900000',
  parameterGroupObject: {
    createParameterGroup: {
      isCollapsed: true,
      username: 'test',
      createdAt: new Date(),
      name: 'parameter',
    },
    updateParameterGroup: {
      name: 'Update parameter',
      updatedAt: new Date(),
      updatedBy: 'test',
    },
  },
  mongoClientResult: {
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
    getParameters: [
      {
        _id: '123456789012345678901233',
        name: 'Renamed Parameter Group',
        isCollapsed: true,
        parameterGroupOrder: 0,
        parameters: [
          {
            _id: '123456789012345678901232',
            appId: '123456789012345678901234',
            parameterGroupId: '123456789012345678901233',
            name: 'Input Parameter',
            type: 'inputBox',
            isRequired: true,
            tooltip: 'Just your average tooltip',
            updatedBy: 'enframe_dev',
            updatedAt: '2019-07-04T09:02:10.407Z',
            isNumeric: false,
            defaultValue: 'Parameter',
          },
        ],
      },
    ],
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
    updateParameterGroup: [
      constants.collection.names.parameterGroup,
      { _id: mongoClient.getObjectId('123456789012345678901234') },
      {
        $set: {
          name: 'Update parameter',
          updatedBy: 'test',
        },
      },
    ],
    moveParameterGroup: [
      [constants.collection.names.application,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        { $pull: { refParameterGroups: mongoClient.getObjectId('123456789012345678901111') } },
      ],
      [constants.collection.names.application,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
        {
          $push: {
            refParameterGroups: {
              $each: [mongoClient.getObjectId('123456789012345678901111')],
              $position: 1,
            },
          },
        },
      ],
    ],
    createParameter: {
      updateOne: [
        constants.collection.names.parameterGroup,
        { _id: mongoClient.getObjectId('123456789012345678901234') },
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
