const workflowConnections = require('../../app/services/global/workflowConnections');
const collectionNameConstants = require('../../app/common/constants').collection.names;
const { connections } = require('../../app/common/constants').airflow;

module.exports = {
  async up(db) {
    const reportsSettings = await db.collection(collectionNameConstants.setting).findOne();
    const { tableau, powerbi } = reportsSettings;

    const tableauConnection = {
      conn_id: connections.tableau,
      conn_type: connections.connectionType,
      conn_host: tableau.server,
      conn_login: tableau.username,
      conn_password: tableau.password,
      conn_extra: {
        authKey: tableau.authKey,
        projectName: tableau.projectName,
        projectId: tableau.projectId,
        siteContentUrl: tableau.siteContentUrl ? tableau.siteContentUrl : '',
      },
    };

    const powerbiConnection = {
      conn_id: connections.powerbi,
      conn_type: connections.connectionType,
      conn_host: 'https://login.microsoftonline.com/common/oauth2/token',
      conn_extra: {
        servicePrincipalKey: powerbi.servicePrincipalKey,
        applicationId: powerbi.applicationId,
        tenantId: powerbi.tenantId,
      },
    };

    await workflowConnections.createConnection(tableauConnection);
    await workflowConnections.createConnection(powerbiConnection);
  },

  async down() {
    await workflowConnections.deleteConnection(connections.tableau);
    await workflowConnections.deleteConnection(connections.powerbi);
  },
};
