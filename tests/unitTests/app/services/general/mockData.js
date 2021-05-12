const mongoClient = require('../../../../../app/dataServices/mongoClient');

module.exports = {
  paramsObject: {
    type: 'application',
  },
  queryObject: {
    parameterId: '123456789012345678901234',
    name: 'test',
  },
  mongoClientParameter: {
    getCollectionPropertyValueCount: {
      parameterId: mongoClient.getObjectId('123456789012345678901234'),
      name: 'test',
    }
  },
  generalDataServicesResult: {
    getInfo: { activeCount: 2, inactiveCount: 1 },
  },
  generalServicesResult: {
    getInfo: {
      appsCount: { all: 3, active: 2, inactive: 1 },
    },
  },
};
