const keycloakConfig = require('config').get('keycloak');
const permission = require('config').get('keycloak.permission');
const RequestHelper = require('../../common/kcRequestHelper');

class Share {
  /**
   * Create resource in Keycloak
   * @return {object} Keycloak Resource Representation
   */
  async createResource(appId, scopes) {
    const resourceObj = {
      name: appId,
      type: 'application',
      uri: `apps/${appId}`,
      ownerManagedAccess: true,
      resource_scopes: scopes,
    };
    return (await new RequestHelper('', {}).url(`${permission.resource}`).post.data(resourceObj).makeRequest()).data;
  }

  /**
   * Removes resource from Keycloak
   * @return {object} Keycloak Resource Representation
   */
  async deleteResource(resourceId) {
    return new RequestHelper('', {}).url(`${permission.resource}${resourceId}`).delete.makeRequest();
  }

  /**
   * Add the required scopes to the Keycloak resource
   * @return {object} Keycloak Resource Representation
   */
  async shareResource(resourceId, userId, scopes) {
    await Promise.all(scopes.map(async (scope) => {
      const requestObj = {
        resource: resourceId,
        requester: userId,
        granted: true,
        scopeName: scope,
      };
      return new RequestHelper('', {})
        .url(`${permission.ticket}`).post.data(requestObj).makeRequest();
    }));
  }

  /**
   * Get the permission tickets for the resource for the resource
   * @return {object} Keycloak Resource Representation
   */
  async getResourceTickets(resourceId) {
    return (await new RequestHelper('', {})
      .get.url(`${permission.ticket}`).params({ resourceId }).makeRequest()).data;
  }

  /**
   * Get the permission tickets for a user
   * @return {object} Keycloak Resource Representation
   */
  async getUserTickets(userId) {
    return (await new RequestHelper('', {}).get.url(`${permission.ticket}`).params({ requester: userId }).makeRequest()).data;
  }

  /**
   * Get the scope name with id for a client
   * @return {object} Keycloak scopes for a client
   */
  async getClientScopes(clientId) {
    return (await new RequestHelper('', {})
      .get.url(`${permission.clients}${clientId}${permission.getScope}`).params({ deep: false }).makeRequest()).data;
  }

  /**
   * get user Resource Permissions scopes for a user
   * @return {object} Keycloak scopes for a client
   */
  async getUserResourcePermissions(userId, resourceId) {
    return (await new RequestHelper('', {})
      .get.url(`${permission.ticket}`).params({ requester: userId, resourceId }).makeRequest()).data;
  }

  /**
   * Remove scopes for a user
   * @return {object} Keycloak scopes for a client
   */
  async removePermissionTickets(permissionTickets) {
    await Promise.all(permissionTickets.map(async (ticket) => {
      await new RequestHelper('', {})
        .url(`${permission.ticket}/${ticket.id}`).delete.makeRequest();
    }));
  }

  /**
   * Get users by role
   * @return {object} Keycloak scopes for a client
   */
  async getUsersByRole(clientId, role) {
    return (await new RequestHelper('', {}).get.url(
      `${keycloakConfig['auth-server-url']}/admin/realms/${keycloakConfig.realm}/clients/${clientId}/roles/${role}/users`,
    ).makeRequest()).data;
  }
}
module.exports = new Share();
