const mongoClient = require('../mongoClient');
const constants = require('../../common/constants');

class Report {
  getReportIdByAppId(appId) {
    return mongoClient.findOne(
      constants.collection.names.report,
      { appId: mongoClient.getObjectId(appId) },
      { _id: 1 },
    );
  }

  getReportByProperty(property, value) {
    const actualValue = ['_id', 'appId'].includes(property) ? mongoClient.getObjectId(value) : value;

    return mongoClient.findOne(
      constants.collection.names.report,
      { [property]: actualValue },
    );
  }

  getReports(appId) {
    const projection = {
      type: 1,
      url: 1,
    };
    return mongoClient.find(
      constants.collection.names.report,
      { appId: mongoClient.getObjectId(appId) },
      projection,
    );
  }

  createReport(appId, reportObject) {
    reportObject.appId = mongoClient.getObjectId(appId);

    return mongoClient.insertOne(
      constants.collection.names.report,
      reportObject,
    );
  }

  updateReport(reportId, reportObject) {
    return mongoClient.updateOne(
      constants.collection.names.report,
      { _id: mongoClient.getObjectId(reportId) },
      { $set: reportObject },
    );
  }

  deleteReport(reportId) {
    return mongoClient.deleteOne(
      constants.collection.names.report,
      { _id: mongoClient.getObjectId(reportId) },
    );
  }
}

module.exports = new Report();
