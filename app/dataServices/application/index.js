const config = require('config');

const postgresConfig = config.get('database.postgres');
const workflowConfig = config.get('workflow');
const mongoClient = require('../mongoClient');
const pgClient = require('../pgClient');
const constants = require('../../common/constants');
const applicationServiceConstants = require('./constants');
const logger = require('../../common/logger');
const RequestHelper = require('../../common/requestHelper');
const scheduleDataService = require('../schedule');
const { deleteSchedule } = require('../../services/schedule/workflowScheduler');

class Application {
  getApplicationData(appId, applicationProperties = []) {
    const projection = applicationProperties.reduce((obj, property) => ({ ...obj, [property]: 1 }), {});
    return mongoClient.findOne(
      constants.collection.names.application,
      { _id: mongoClient.getObjectId(appId) },
      projection,
    );
  }

  getAppIdByScriptName(appId, fileName) {
    const query = {
      _id: mongoClient.getObjectId(appId),
      scripts: fileName,
    };
    const projection = {
      _id: 1,
    };

    return mongoClient.findOne(constants.collection.names.application, query, projection);
  }

  getAppIdByUrl(url) {
    const query = {
      url,
    };
    const projection = {
      _id: 1,
    };

    return mongoClient.findOne(constants.collection.names.application, query, projection);
  }

  getAppByName(appName) {
    return mongoClient.findOne(constants.collection.names.application, {
      name: appName,
    });
  }

  getTagByName(appId, tagName) {
    return mongoClient.findOne('tags', {
      name: tagName,
      appId: mongoClient.getObjectId(appId),
    });
  }

  getTag(appId, tagObject) {
    return mongoClient.findOne('tags', {
      name: tagObject.name,
      class: tagObject.class,
      appId: mongoClient.getObjectId(appId),
    });
  }

  getAppCountByUrlBeginning(appUrl) {
    return mongoClient.countDocuments(constants.collection.names.application, { url: new RegExp(`^${appUrl}`) });
  }

  getApplicationCountByThemeId(themeId) {
    return mongoClient.countDocuments(
      constants.collection.names.application,
      { 'theme.id': mongoClient.getObjectId(themeId) },
    );
  }

  async deleteAllApplicationData(appId) {
    const appObjectId = mongoClient.getObjectId(appId);
    const requestHelper = new RequestHelper().url(`${workflowConfig.apiBaseUrl}/drop/app/${appId}`).delete;
    const schedules = await scheduleDataService.getSchedules(appId);
    return Promise.all([
      mongoClient.deleteMany(constants.collection.names.action, { appId: appObjectId }),
      mongoClient.deleteMany(constants.collection.names.application, { _id: appObjectId }),
      mongoClient.deleteMany(constants.collection.names.configuration, { _id: appObjectId }),
      mongoClient.deleteMany(constants.collection.names.parameter, { appId: appObjectId }),
      mongoClient.deleteMany(constants.collection.names.parameterGroup, { appId: appObjectId }),
      mongoClient.deleteMany(constants.collection.names.table, { appId: appObjectId }),
      mongoClient.deleteMany(constants.collection.names.report, { appId: appObjectId }),
      requestHelper.makeRequest(),
      ...schedules.map((schedule) => {
        return deleteSchedule(schedule._id);
      }),
      mongoClient.deleteMany(constants.collection.names.schedule, { appId: appObjectId }),
    ]);
  }

  async deleteApplicationDatabase(database) {
    const { databaseName, roles } = database;
    await pgClient.executeQuery(`SELECT pg_terminate_backend(pid) FROM pg_stat_get_activity(NULL::integer)
      WHERE datid=(SELECT oid from pg_database where datname = '${databaseName}');`);

    await pgClient.executeQuery(`DROP DATABASE IF EXISTS ${databaseName};`);

    const deleteRolesQuery = Object.values(roles).map(
      role => `DROP USER IF EXISTS ${role.dbusername};DROP ROLE IF EXISTS ${role.roleName};`,
    ).join('');
    logger.info('Deleting DB roles.');
    await pgClient.executeQuery(deleteRolesQuery);

    logger.info('Deleting DBA role.');
    await pgClient.executeQuery(`DROP USER IF EXISTS ${database.username};DROP ROLE IF EXISTS ${database.roleName};`);
  }

  getApplications(query = {}, user, sharedApps) {
    const {
      limit, skip, filter, filterBy, sortBy, sortDirection, statuses,
    } = query;
    const filterObj = applicationServiceConstants.getFilterRulesbyUser(user, sharedApps);
    if (Array.isArray(filterBy) && filterBy.length) {
      filterObj.$and = [{ $or: filterBy.map(filterByItem => ({ [filterByItem]: new RegExp(filter, 'i') })) }];
    }
    if (Array.isArray(statuses) && statuses.length) filterObj.status = { $in: statuses };
    const sort = sortBy ? { [sortBy]: sortDirection } : {};
    const projection = {
      _id: 1,
      name: 1,
      description: 1,
      url: 1,
      status: 1,
      theme: 1,
      createdBy: 1,
      createdAt: 1,
      updatedAt: 1,
      version: 1,
      resourceId: 1,
    };
    return mongoClient.find(constants.collection.names.application, filterObj, projection, sort, limit, skip);
  }

  getApplication(appId) {
    const query = {
      _id: mongoClient.getObjectId(appId),
    };

    const projection = {
      name: 1,
      displayName: 1,
      description: 1,
      url: 1,
      resourceId: 1,
      status: 1,
      isPrivate: 1,
      database: 1,
      segments: 1,
      theme: 1,
      createdBy: 1,
      createdAt: 1,
      updatedBy: 1,
      updatedAt: 1,
      version: 1,
    };
    return mongoClient.findOne(constants.collection.names.application, query, projection);
  }

  createApplication(appObject) {
    const document = {
      name: appObject.name,
      displayName: appObject.name,
      description: appObject.description,
      type: appObject.type,
      status: appObject.status,
      ...constants.defaultProperties.application,
      database: {
        serverName: postgresConfig.host,
        port: postgresConfig.port,
      },
      theme: appObject.theme,
      createdBy: appObject.username,
      createdAt: appObject.createdAt,
      updatedBy: appObject.username,
      updatedAt: appObject.createdAt,
    };
    return mongoClient.insertOne(constants.collection.names.application, document);
  }

  updateApplication(appId, appObject) {
    if (appObject['theme.id']) {
      appObject['theme.id'] = mongoClient.getObjectId(appObject['theme.id']);
    }

    return mongoClient.updateOne(
      constants.collection.names.application,
      { _id: mongoClient.getObjectId(appId) },
      { $set: appObject },
    );
  }

  getTags(appId) {
    const query = {
      appId: mongoClient.getObjectId(appId),
    };
    return mongoClient.distinct(constants.collection.names.table, 'tag', query);
  }

  getScripts(appId) {
    const query = {
      _id: mongoClient.getObjectId(appId),
    };
    const projection = {
      scripts: 1,
    };
    return mongoClient.findOne(constants.collection.names.application, query, projection);
  }

  addScript(appId, fileNames) {
    const query = {
      _id: mongoClient.getObjectId(appId),
    };
    const update = {
      $addToSet: {
        scripts: { $each: fileNames },
      },
    };
    return mongoClient.updateOne(constants.collection.names.application, query, update);
  }

  deleteScript(appId, fileName) {
    const query = {
      _id: mongoClient.getObjectId(appId),
    };
    const update = {
      $pull: {
        scripts: fileName,
      },
    };
    return mongoClient.updateOne(constants.collection.names.application, query, update);
  }

  updateConfiguration(appId, key, configData) {
    return mongoClient.updateOne(
      constants.collection.names.configuration,
      { _id: mongoClient.getObjectId(appId) },
      { $set: { [key]: configData } },
      { upsert: true },
    );
  }

  getConfigurations(appId) {
    return mongoClient.findOne(
      constants.collection.names.configuration,
      { _id: mongoClient.getObjectId(appId) },
      { _id: 0 },
    );
  }

  async getSchemas(database, scenarioIds) {
    // dblink used to connect to the app database and get list of schemas
    const scenarioList = scenarioIds.map(s => `''scenario_${s}''`).join(',');
    const query = `
      CREATE EXTENSION IF NOT EXISTS dblink;
      SELECT * FROM dblink('dbname=${database} user=${postgresConfig.username}',
        'SELECT nspname FROM pg_catalog.pg_namespace WHERE nspname IN (${scenarioList})
          UNION
          SELECT nspname FROM pg_catalog.pg_namespace
            WHERE nspname NOT LIKE ''pg_%''
            AND nspname NOT LIKE ''scenario_%''
            AND nspname NOT IN (''information_schema'');'
      ) AS t1(schema TEXT);
    `;
    logger.info('getschema:', query);
    const result = await pgClient.executeQuery(query);
    const schemas = result[1].rows.map(row => row.schema);
    schemas.push('scenario_parent');
    return schemas;
  }
}

module.exports = new Application();
