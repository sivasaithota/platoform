const mongoClient = require('../../../../../app/dataServices/mongoClient');
const constants = require('../../../../../app/common/constants');

module.exports = {
  typeName: 'application',
  queryObject: {
    parameterId: '123456789012345678901234',
    name: 'test',
  },
  mongoClientParameter: {
    getCollectionPropertyValueCount: {
      parameterId: mongoClient.getObjectId('123456789012345678901234'),
      name: 'test',
    },
  },
  generalDataServicesResult: {
    getInfo: [{ activeCount: 0, inactiveCount: 0 },
      { activeCount: 2, inactiveCount: 1 },
    ],
  },
  mongoClientResult: {
    getInfo: [
      { _id: 'IN-PROGRESS', count: 1 },
      { _id: 'ACTIVE', count: 2 },
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
