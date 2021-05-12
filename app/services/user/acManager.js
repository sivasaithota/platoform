const RequestHelper = require('../../common/kcRequestHelper');
const logger = require('../../common/logger');
const constants = require('../../dataServices/application/constants');
const { acRoles } = require('../../common/constants');

class ACManager {
  async getACUser(email, url) {
    try {
      logger.info('Getting user from analytics center', email);
      const data = {
        email,
      };
      return new RequestHelper('', {}).url(`http://router:80/apps/${url}/user/getUser`)
        .post.data(data).makeRequest();
    } catch (error) {
      logger.error('Error retrieving user from analytics center');
      throw error;
    }
  }

  async createACUser(userObject, url) {
    try {
      logger.info('Creating user in analytics center', userObject);
      const data = {
        user: userObject,
        updateEnframe: false,
      };
      return new RequestHelper('', {}).url(`http://router:80/apps/${url}/user`)
        .post.data(data).makeRequest();
    } catch (error) {
      logger.error('Error creating user in analytics center');
      throw error;
    }
  }

  async updateACUser(email, scopes, url) {
    try {
      const user = (await this.getACUser(email, url)).data;
      const role = scopes.includes('create') ? acRoles.consultant : acRoles.analystReadOnly;
      const data = {
        email,
        id: user.id,
        role,
        updateEnframe: false,
      };
      logger.info('Updating user in analytics center', data);
      return new RequestHelper('', {}).url(`http://router:80/apps/${url}/user/${user.id}`)
        .put.data(data).makeRequest();
    } catch (error) {
      logger.error('Error updating user in analytics center');
      throw error;
    }
  }

  async deleteACUser(userObject, updateac, url) {
    try {
      logger.info('Removing user from analytics center', userObject);
      const user = (await this.getACUser(userObject.email, url)).data;
      return new RequestHelper('', {}).url(`http://router:80/apps/${url}/user/${user.id}`)
        .delete.makeRequest();
    } catch (error) {
      logger.error('Error removing user from analytics center');
      throw error;
    }
  }
}
module.exports = new ACManager();
