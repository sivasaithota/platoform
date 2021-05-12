const versionConfig = require('config').get('versions');
const globalDataService = require('../../dataServices').global;
const logger = require('../../common/logger');
const constants = require('../../common/constants');
const helper = require('../../common/helper');
const workflowConnections = require('./workflowConnections');

class Global {
  async getDatatypes() {
    logger.debug('Executing query to get the list of datatypes');
    try {
      const result = await globalDataService.getTemplate(constants.types.template.datatype);
      logger.debug('Retrieved result from the database');
      return result ? result.collection : null;
    } catch (err) {
      logger.error('Error while getting datatypes', err);
      throw err;
    }
  }

  async getParameterTypes() {
    logger.debug('Executing query to get the list of parameter types');
    try {
      const result = await globalDataService.getTemplate(constants.types.template.parameterType);
      logger.debug('Retrieved result from the database');
      return result ? result.collection : null;
    } catch (err) {
      logger.error('Error while getting parameter types', err);
      throw err;
    }
  }

  async getReportTypes() {
    logger.debug('Executing query to get the list of report types');
    try {
      const result = await globalDataService.getTemplate(constants.types.template.reportType);
      logger.debug('Retrieved result from the database');
      return result ? result.collection : null;
    } catch (err) {
      logger.error('Error while getting report types', err);
      throw err;
    }
  }

  async getInfo(user) {
    logger.debug('Executing query to get enframe info');
    try {
      const stats = await globalDataService.getInfo(user);
      logger.debug('Retrieved result from the database', stats);
      const { active, inactive, inProgress } = constants.string.application.status;
      return {
        latestACVersion: versionConfig.analyticsCenterVersion,
        appsCount: {
          [active]: stats.activeCount,
          [inactive]: stats.inactiveCount,
          [inProgress]: stats.inProgressCount,
        },
      };
    } catch (err) {
      logger.error('Error while getting enframe info', err);
      throw err;
    }
  }

  async getCheckUnique(paramsObject, queryObject) {
    logger.debug('Executing query to get property uniqueness');
    try {
      const result = await globalDataService.getCollectionPropertyValueCount(paramsObject.type, queryObject);
      logger.debug('Retrieved result from the database', result);

      return {
        isUnique: result === 0,
      };
    } catch (err) {
      logger.error('Error while getting property uniqueness', err);
      throw err;
    }
  }

  async getSetting() {
    logger.debug('Executing query to get the global settings');
    try {
      const result = await globalDataService.getSetting();
      logger.debug('Retrieved result from the database', result);
      return result;
    } catch (err) {
      logger.error('Error while getting global settings', err);
      throw err;
    }
  }

  async updateSetting(settingObject) {
    logger.debug('Executing query to update the global settings');
    try {
      const result = await globalDataService.updateSetting(helper.flattenObject(settingObject));
      const { tableau, powerbi } = settingObject;
      if (tableau) {
        const tableauConnection = {
          conn_type: constants.airflow.connections.connectionType,
          conn_host: tableau.server,
          conn_login: tableau.username,
          conn_password: tableau.password,
          conn_extra: {
            authKey: tableau.authKey,
            projectName: tableau.projectName,
            projectId: tableau.projectId,
            siteContentUrl: tableau.siteContentUrl,
          },
        };
        await workflowConnections.updateConnection(constants.airflow.connections.tableau, tableauConnection);
      } else if (powerbi) {
        const powerBiConnection = {
          conn_type: constants.airflow.connections.connectionType,
          conn_host: 'https://login.microsoftonline.com/common/oauth2/token',
          conn_extra: {
            servicePrincipalKey: powerbi.servicePrincipalKey,
            applicationId: powerbi.applicationId,
            tenantId: powerbi.tenantId,
          },
        };
        await workflowConnections.updateConnection(constants.airflow.connections.powerbi, powerBiConnection);
      }
      logger.debug('Updated result in the database', result);
      return {
        result: result.modifiedCount > 0,
      };
    } catch (err) {
      logger.error('Error while updating global settings', err);
      throw err;
    }
  }
}

module.exports = new Global();
