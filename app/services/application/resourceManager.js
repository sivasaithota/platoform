const permission = require('config').get('keycloak.permission');
const constants = require('../../common/constants');
const logger = require('../../common/logger');
const userService = require('../../services/user');
const RequestHelper = require('../../common/kcRequestHelper');
const shareService = require('../user/share');
const acManager = require('../user/acManager');

class resourceHelper {
  async createResource(appId) {
    try {
      logger.info('Creating Resource for app in keycloak', appId);
      const resource = await shareService.createResource(appId, permission.scopes);
      return resource;
    } catch (error) {
      logger.error('Error creating resource', error.response.data.error_description);
      throw error;
    }
  }

  async deleteResource(resourceId) {
    try {
      logger.info('Removing resource from keycloak', resourceId);
      return shareService.deleteResource(resourceId);
    } catch (error) {
      logger.error('Error deleting resource', constants.application.delete.error);
      throw error;
    }
  }

  async createACUser(userObject, url) {
    try {
      logger.info('Creating user in analytics center', userObject);
      return new RequestHelper('', {}).url(`http://router:80/apps/${url}/user`)
        .post.data(userObject).makeRequest();
    } catch (error) {
      logger.error('Error creating user in analytics center');
      throw error;
    }
  }

  async shareApp(resourceId, userId, scopes, updateac, url) {
    try {
      logger.info('Sharing Resource with user', userId);
      const userObject = await userService.getUser(userId);
      if (userObject.role.name === constants.roles.appViewer) {
        scopes = constants.scopes.appViewer;
      }
      await shareService.shareResource(resourceId, userId, scopes);
      userObject.role = scopes.includes('create') ? 'Consultant' : 'Analyst_ReadOnly';
      if (url && updateac) acManager.createACUser(userObject, url);
      return constants.share.create.success;
    } catch (error) {
      logger.error('Error sharing application', error);
      throw error;
    }
  }

  async getSharedUsers(query, resourceId) {
    try {
      const {
        first, max, search, shared,
      } = Object.keys(query).length === 0 ? constants.user.defaultQuery : (query);
      logger.info('Get users for app', resourceId);
      const { users } = await userService.getUsers({ first: 1, max: 1000, search });
      const permissionTickets = await shareService.getResourceTickets(resourceId);
      const adminIds = await this.getAdmins();
      const userIds = permissionTickets.map(user => user.requester)
        .filter((value, index, self) => self.indexOf(value) === index);
      if (JSON.parse(shared)) {
        const { sharedUsers, count } = await this.getAppUsers(users, first, max, resourceId);
        return { users: sharedUsers, count };
      }
      const userList = users.filter(user => !userIds.includes(user.id)).filter(user => !adminIds.includes(user.id))
      .slice(first - 1, (first - 1) + max);
      const count = userList.length;
      return { users: userList, count };
    } catch (error) {
      logger.error('Error retrieving shared users', error);
      throw error;
    }
  }

  async getAppUsers(users, first, max, resourceId) {
    const usersWithScopes = await Promise.all(users.map(async (user) => {
      const userScopes = await this.getUserScopes(user.id, resourceId);
      if (userScopes.length > 0) {
        const scopes = userScopes.map((scope) => scope.name);
        user.scopes = scopes;
        return user;
      }
    }));
    const count = usersWithScopes.filter(Boolean).length;
    const sharedUsers = usersWithScopes.filter(Boolean).slice(first - 1, (first - 1) + max);
    return { sharedUsers, count };
  }

  async getAdmins() {
    const clientId = (await userService.getClient()).id;
    const adminList = await Promise.all(constants.roles.adminRoles.map(async (role) => {
      const admin = await shareService.getUsersByRole(clientId, role);
      return admin;
    }));
    const userIds = adminList.flat().map(user => { return user.id; });
    return userIds;
  }

  async getSharedUserCount(resourceId) {
    try {
      logger.info('Retrieving shared user count');
      const userCount = (await this.getSharedUsers({ first: 1, max: 1000, shared: 'true' }, resourceId)).count;
      return userCount;
    } catch (error) {
      logger.error('Error retrieving shared user count', error);
      throw error;
    }
  }

  async getPermissionTickets(userId) {
    try {
      logger.info('Get resource shared with', userId);
      return shareService.getUserTickets(userId);
    } catch (error) {
      logger.error('Error retrieving shared apps for the user', error);
      throw error;
    }
  }

  async getUserScopes(userId, resourceId) {
    try {
      logger.info('Get app scopes for user');
      const userPermissions = await shareService.getUserResourcePermissions(userId, resourceId);
      const scopeObject = await this.getClientScopes();
      userPermissions.forEach(u => { u.name = scopeObject[u.scope]; });
      return userPermissions;
    } catch (error) {
      logger.error('Error retrieving user scopes', error);
      throw error;
    }
  }

  async getClientScopes() {
    const clientId = (await userService.getClient()).id;
    const clientScopes = await shareService.getClientScopes(clientId);
    const scopeObject = clientScopes.reduce((sObj, s) => { sObj[s.id] = s.name; return sObj; }, {});
    return scopeObject;
  }

  async updateShare(resourceId, userId, scopes, updateac, url) {
    try {
      logger.info('Updating sharing settings for app');
      const userObject = await userService.getUser(userId);
      if (url && updateac) await acManager.updateACUser(userObject.email, scopes, url);
      await this.removeShare([userId], resourceId, updateac, url);
      await this.shareApp(resourceId, userId, scopes, updateac, url);
      return constants.share.create.success;
    } catch (error) {
      logger.error('Error updating user share application', error);
      throw error;
    }
  }

  async removeShare(userIds, resourceId, updateac, url) {
    try {
      logger.info('Deleting Permissions for the user');
      await Promise.all(userIds.map(async (userId) => {
        await this.removePermission(userId, resourceId);
        if (url && updateac) {
          const userObject = await userService.getUser(userId);
          await acManager.deleteACUser(userObject, updateac, url);
        }
      }));
      return constants.share.delete.success;
    } catch (error) {
      logger.error('Error removing application share', error);
      throw error;
    }
  }

  async removePermission(userId, resourceId) {
    logger.info('Removing permission tickets for the user', userId);
    const permissionTickets = await this.getUserScopes(userId, resourceId);
    await shareService.removePermissionTickets(permissionTickets);
  }
}

module.exports = resourceHelper;