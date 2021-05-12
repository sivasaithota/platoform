const collectionNameConstants = require('../../app/common/constants').collection.names;

const settings = {
  powerbi: {
    servicePrincipalKey: 'PQ8pbABpISeKj9+X4Or9xLPeYtyJe+VolfSMeGZh+Q0=',
    applicationId: 'e7458bef-6dc7-4e1b-bce1-d03e553c91bc',
    tenantId: '7aa899fd-d23c-4f48-adb2-d093eea2a204',
  },
  tableau: {
    server: 'https://tableau.opexanalytics.com',
    username: 'tableauuser',
    password: '0a96UldMi5Cly7Hm',
    site: '/sites/e61a911d-08c0-4d6a-8f6a-8d6ecebaedae',
    reportServer: 'http://tableau.opexanalytics.com:8002',
    authKey: 'WKuxMkls056p+0v6MWmILCSlgnt+tU7qTh7iNTsg/Qs=',
    projectId: '875be8b2-a87c-4c9e-9b3e-498aebcdc2bf',
    projectName: 'Enframe Dev',
  },
  acceptedDomain: [
    'opexanalytics.com',
  ],
};
module.exports = {
  async up(db) {
    await db.createCollection(collectionNameConstants.setting);
    await db.collection(collectionNameConstants.setting).insertOne(settings);
  },

  async down(db) {
    await db.collection(collectionNameConstants.setting).drop();
  },
};
