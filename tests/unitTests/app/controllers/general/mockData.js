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
  requestObj: {
    params: {
      type: 'application',
    },
    query: {
      parameterId: '123456789012345678901234',
      name: 'test',
    },
  },
  mongoClientParameter: {
    getCheckUnique: {
      parameterId: mongoClient.getObjectId('123456789012345678901234'),
      name: 'test',
    },
  },
  mongoClientResult: {
    getInfo: [
      { _id: 'IN-PROGRESS', count: 1 },
      { _id: 'ACTIVE', count: 2 },
    ],
    getParameterTypes: {
      collection: [
        {
          typeName: 'input Box',
          displayName: 'input Box',
          properties: [
            { name: 'isNumeric', displayName: 'Numeric only', type: 'Boolean' },
            { name: 'default value', displayName: 'Default Value' },
          ],
        },
      ],
    },
    getDatatypes: {
      collection: [
        { typeName: 'varchar', properties: ['length'] },
      ],
    },
  },
  servicesResult: {
    getInfo: [
      { appsCount: { all: 3, active: 2, inactive: 1 } },
      { appsCount: { all: 0, active: 0, inactive: 0 } },
    ],
  },
  getEnframeInfoAggregatePipeline: [
    {
      $match: {
        status: { $nin: [constants.string.application.status.deleted] },
      },
    },
    {
      $group: { _id: '$status', count: { $sum: 1 } },
    },
  ],
};
module.exports = mockData;
