const mongoClient = require('../mongoClient');
const constants = require('../../common/constants');
const dataServiceConstants = require('./constants');
const applicationServiceConstants = require('../application/constants.js');
const ResourceManager = require('./../../services/application/resourceManager');

class Global {
  async getTemplateType(templateName, typeName) {
    const projection = {
      collection: {
        $elemMatch: {
          typeName,
        },
      },
    };
    const query = {
      name: templateName,
    };
    const template = await mongoClient.findOne(constants.collection.names.template, query, projection);
    return template.collection ? template.collection[0] : null;
  }

  async getTemplate(templateName) {
    const projection = {
      collection: 1,
    };
    const query = {
      name: templateName,
    };
    return mongoClient.findOne(constants.collection.names.template, query, projection);
  }

  async getInfo(user) {
    const permissions = await new ResourceManager().getPermissionTickets(user.sub);
    const sharedApps = permissions.map(resp => resp.resource)
      .filter((value, index, self) => self.indexOf(value) === index);
    const filterObj = applicationServiceConstants.getFilterRulesbyUser(user, sharedApps);
    filterObj.$and = [{ status: { $nin: [constants.string.application.status.deleted] } }];
    const aggregationPipeline = dataServiceConstants.getEnframeInfoAggregatePipeline(filterObj);
    const result = await mongoClient.aggregate(constants.collection.names.application, aggregationPipeline);

    const stats = {
      activeCount: 0,
      inactiveCount: 0,
      inProgressCount: 0,
    };

    result.forEach((stat) => {
      if (stat._id === constants.string.application.status.active) {
        stats.activeCount += stat.count;
      } else if (stat._id === constants.string.application.status.inProgress) {
        stats.inProgressCount += stat.count;
      } else {
        stats.inactiveCount += stat.count;
      }
    });

    return stats;
  }

  async getCollectionPropertyValueCount(typeName, queryProperties) {
    Object.entries(queryProperties).forEach(([name, value]) => {
      if (name.toLocaleLowerCase().endsWith('id')) {
        queryProperties[name] = mongoClient.getObjectId(value);
      }
    });
    return mongoClient.countDocuments(constants.collection.names[typeName], queryProperties);
  }

  getSetting(...settings) {
    const projection = settings.reduce((p, s) => ({ ...p, [s]: 1 }), {});
    return mongoClient.findOne(constants.collection.names.setting, {}, projection);
  }

  async updateSetting(settingObject) {
    const result = await mongoClient.updateOne(
      constants.collection.names.setting,
      {},
      { $set: settingObject },
    );
    return result;
  }
}

module.exports = new Global();
