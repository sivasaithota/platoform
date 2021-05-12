const mongoClient = require('../mongoClient');
const constants = require('../../common/constants');
const { projections } = require('./constants');

class Schedule {
  getScheduleCountByProperties(properties, limit) {
    if (properties._id) properties._id = mongoClient.getObjectId(properties._id);
    if (properties.appId) properties.appId = mongoClient.getObjectId(properties.appId);

    return mongoClient.countDocuments(
      constants.collection.names.schedule,
      properties,
      { limit },
    );
  }

  getScheduleByProperties(properties) {
    if (properties._id) properties._id = mongoClient.getObjectId(properties._id);
    if (properties.appId) properties.appId = mongoClient.getObjectId(properties.appId);

    return mongoClient.findOne(
      constants.collection.names.schedule,
      properties,
    );
  }

  getSchedules(appId) {
    return mongoClient.find(
      constants.collection.names.schedule,
      { appId: mongoClient.getObjectId(appId) },
      projections.getAll,
    );
  }

  createSchedule(appId, schedule) {
    return mongoClient.insertOne(
      constants.collection.names.schedule,
      { appId: mongoClient.getObjectId(appId), ...schedule },
    );
  }

  updateSchedule(scheduleId, schedule) {
    return mongoClient.updateOne(
      constants.collection.names.schedule,
      { _id: mongoClient.getObjectId(scheduleId) },
      { $set: schedule },
    );
  }

  deleteSchedule(scheduleId) {
    return mongoClient.deleteOne(
      constants.collection.names.schedule,
      { _id: mongoClient.getObjectId(scheduleId) },
    );
  }
}

module.exports = new Schedule();
