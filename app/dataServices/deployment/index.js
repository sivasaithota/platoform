const mongoClient = require('../mongoClient');
const constants = require('../../common/constants');

class Deployment {
  updateDeployStatus(appId, deployObject) {
    return mongoClient.updateOne('applications', {
      _id: mongoClient.getObjectId(appId),
    }, {
      $set: deployObject,
    });
  }

  updateShiny(appId, deployObject) {
    return mongoClient.updateOne(
      constants.collection.names.report,
      { appId: mongoClient.getObjectId(appId) },
      {
        url: deployObject.url,
        status: deployObject.status,
      },
    );
  }

  getAllApplicationData(appId) {
    return mongoClient.findOne(constants.collection.names.application, { _id: mongoClient.getObjectId(appId) });
  }
}

module.exports = new Deployment();
