const Keycloak = require('../../common/keycloak');
const logger = require('../../common/logger');
const constants = require('../../common/constants');

class User {
  async getUsers(query) {
    const keycloak = new Keycloak();
    await keycloak.init();
    if (!query.search) {
      query.first -= 1;
      const userList = await keycloak.getUsers(query);
      const users = await this.userFilter(userList);
      const count = users.length;
      return { users, count };
    }
    const userList = await keycloak.getUsers({ search: query.search });
    const filteredUsers = await this.userFilter(userList);
    const count = filteredUsers.length;
    const users = filteredUsers.slice(query.first - 1, (query.first - 1) + query.max);
    return { users, count };
  }

  async usersWithRoles(users) {
    const keycloak = new Keycloak();
    await keycloak.init();
    const clientId = (await keycloak.getClient())[0].id;
    return Promise.all(users.map(async (user) => {
      [user.role] = (await keycloak.getUserClientRole(user.id, clientId));
      return user;
    }));
  }

  async userFilter(userList) {
    const usersWithRoles = await this.usersWithRoles(userList);
    return usersWithRoles.map(user => (
      {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        attributes: user.attributes,
        createdTimestamp: user.createdTimestamp,
      }));
  }

  async getUser(userId) {
    const keycloak = new Keycloak();
    await keycloak.init();
    const user = await keycloak.getUser(userId);
    const clientId = (await keycloak.getClient())[0].id;
    [user.role] = (await keycloak.getUserClientRole(userId, clientId));
    return user;
  }

  async getUserCount() {
    const keycloak = new Keycloak();
    await keycloak.init();
    return (await keycloak.getUsers({ max: '2000' })).length;
  }

  async getClient() {
    const keycloak = new Keycloak();
    await keycloak.init();
    const client = (await keycloak.getClient())[0];
    return client;
  }

  async getClientRoles() {
    const keycloak = new Keycloak();
    await keycloak.init();
    const clientId = (await keycloak.getClient())[0].id;
    const clientRoles = keycloak.getClientRoles(clientId);
    return clientRoles;
  }

  async addUser(user) {
    const keycloak = new Keycloak();
    logger.info('Adding user to keycloak');
    await keycloak.init();
    const userInfo = await keycloak.createUser(user);
    await this.updateUser(userInfo.id, user);
    return userInfo;
  }

  async updateUser(userId, user) {
    const keycloak = new Keycloak();
    logger.info('Updating user in keycloak');
    await keycloak.init();
    await keycloak.updateUser(userId, user);
    if (user.password) await keycloak.resetPassword(userId, user.password);
    if (!user.role) return;
    const clientId = (await keycloak.getClient())[0].id;
    const currentRole = (await keycloak.getUserClientRole(userId, clientId))[0];
    await keycloak.deleteClientRole(userId, currentRole);
    await keycloak.addClientRole(userId, user.role);
  }


  async deleteUser(userIds, currentUserId) {
    const keycloak = new Keycloak();
    logger.info('Deleting users in keycloak');
    await keycloak.init();
    const error = { status: constants.httpCodes.forbidden, message: constants.user.delete.error };
    userIds.forEach((userId) => {
      if (currentUserId === userId) throw error;
      keycloak.deleteUser(userId);
    });
  }
}

module.exports = new User();
