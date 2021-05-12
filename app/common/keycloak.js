const keycloakConfig = require('config').get('keycloak');
const KcAdminClient = require('keycloak-admin').default;
const logger = require('../common/logger');

class KeycloakManager {
  async init() {
    this.keycloakAdmin = new KcAdminClient({
      baseUrl: keycloakConfig['auth-server-url'],
      realmName: keycloakConfig.realm,
    });
    try {
      logger.info('authenticating with keycloak');
      const kcAdmin = await this.keycloakAdmin.auth(keycloakConfig.credentials);
      return kcAdmin;
    } catch (error) {
      logger.error('error auth', error);
    }
  }

  getUsers(query) {
    logger.info('Fetching users from keycloak', query);
    return this.keycloakAdmin.users.find(query);
  }

  getUser(userId) {
    logger.info('Fetching user from keycloak', userId);
    return this.keycloakAdmin.users.findOne({
      id: userId,
    });
  }

  getUserRole(userId) {
    logger.info('Fetching user role from keycloak');
    return this.keycloakAdmin.users.listRoleMappings({
      id: userId,
    });
  }

  getUserClientRole(userId, clientId) {
    logger.info('Fetching client user role from keycloak');
    return this.keycloakAdmin.users.listClientRoleMappings({
      id: userId,
      clientUniqueId: clientId,
    });
  }

  getClient() {
    logger.info('Fetching client info from keycloak');
    return this.keycloakAdmin.clients.find({ clientId: keycloakConfig.resource });
  }

  getClientRoles(clientId) {
    logger.info('Fetching client roles from keycloak');
    return this.keycloakAdmin.clients.listRoles({
      id: clientId,
    });
  }

  createUser(user) {
    logger.info('Creating a new user in keycloak');
    return this.keycloakAdmin.users.create({
      realm: 'enframe',
      username: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      enabled: true,
      attributes: {
        type: user.type,
      },
    });
  }

  updateUser(userId, user) {
    logger.info('Updating User in keycloak', userId);
    return this.keycloakAdmin.users.update(
      { id: userId },
      {
        username: user.username,
        firstName: user.firstname,
        lastName: user.lastname,
        enabled: true,
        attributes: {
          type: user.type,
        },
      },
    );
  }

  deleteUser(userId) {
    try {
      logger.info('Deleting user from keycloak', userId);
      return this.keycloakAdmin.users.del({
        id: userId,
      });
    } catch (error) {
      logger.info('Error deleting user from keycloak', error);
      throw error;
    }
  }

  addClientRole(userId, role) {
    logger.info('Add client role mapping to user', userId);
    return this.keycloakAdmin.users.addClientRoleMappings({
      id: userId,
      clientUniqueId: role.containerId,
      roles: [
        {
          id: role.id,
          name: role.name,
        },
      ],
    });
  }

  deleteClientRole(userId, role) {
    logger.info('Deleting client role mapping to user', userId);
    return this.keycloakAdmin.users.delClientRoleMappings({
      id: userId,
      clientUniqueId: role.containerId,
      roles: [
        {
          id: role.id,
          name: role.name,
        },
      ],
    });
  }

  resetPassword(userId, password) {
    logger.info('Setting password for user in keycloak', userId);
    return this.keycloakAdmin.users.resetPassword({
      id: userId,
      credential: {
        temporary: false,
        type: 'password',
        value: password,
      },
    });
  }
}
module.exports = KeycloakManager;
