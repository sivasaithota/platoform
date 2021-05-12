

module.exports = {
  paramsObject: {
    appId: '123456789012345678901234',
    parameterGroupId: '123456789012345678901234',
  },
  userObject: {
    username: 'test',
  },
  moveParmeter: {
    parameterMap: {
      '5d1c3073c146b00016d35ced': ['5d1c325adfde190015fe8650'],
    },
    position: 1,
  },
  deleteParametersObject: {
    parameterMap: {
      '5d1c3073c146b00016d35ced': ['5d1c325adfde190015fe8650'],
    },
  },
  queryObject: { parametersMovedToGroupId: '123456789012345678900000' },
  moveObject: { position: 1 },
  parameterObject: {
    createParameterGroup: {
      name: 'parameter',
      isCollapsed: true,
    },
    updateParameterGroup: {
      name: 'updated Parameter',
    },
    createParameter: {
      name: 'Input Parameter 1',
      type: 'inputBox',
      isNumeric: true,
      defaultValue: 1,
      isRequired: true,
      tooltip: 'Just your average tooltip',
    },
    updateParameter: {
      name: 'Input Parameter 1',
      type: 'inputBox',
      isNumeric: true,
      defaultValue: 1,
      isRequired: true,
      tooltip: 'Just your average tooltip',
    },
  },
  parameterDataServiceResult: {
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
    insertOne: {
      insertedId: 1,
    },
    updateOne: [
      {
        result: {
          nModified: 10,
        },
      },
      {
        result: {
          nModified: 0,
        },
      },
    ],
    deleteMany: {
      result: {
        n: 1,
      },
    },
    updateMany: {
      result: {
        nModified: 1,
      },
    },
  },
  mongoClientParameter: {
    createParameterGroup: {
      name: 'parameter',
      isCollapsed: true,
      username: 'test',
    },
    updateParameterGroup: [
      {
        appId: '123456789012345678901234',
        parameterGroupId: '123456789012345678901234',
      },
      {
        name: 'updated Parameter',
        updatedBy: 'test',
      },
    ],
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
      ['name', 'type', 'isNumeric', 'defaultValue', 'isRequired', 'tooltip', 'username', 'specificProperties', 'createdAt'],
      ['isNumeric', 'defaultValue'],
    ],
    updateParameter: [
      ['name', 'type', 'isNumeric', 'defaultValue', 'isRequired', 'tooltip', 'updatedBy', 'specificProperties', 'updatedAt'],
      ['isNumeric', 'defaultValue'],
    ],
  },
};
