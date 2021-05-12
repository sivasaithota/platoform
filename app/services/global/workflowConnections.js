const workflowConfig = require('config').get('workflow');
const RequestHelper = require('../../common/requestHelper');

class WorkbookConnection {
  async createConnection(settings) {
    const requestHelper = new RequestHelper(workflowConfig.apiBaseUrl);
    return requestHelper.post.url('connection/create')
      .data(settings).makeRequest();
  }

  async updateConnection(connId, settings) {
    const requestHelper = new RequestHelper(workflowConfig.apiBaseUrl);
    return requestHelper.put.url(`connection/update/${connId}`)
      .data(settings).makeRequest();
  }

  async deleteConnection() {
    const requestHelper = new RequestHelper(workflowConfig.apiBaseUrl);
    return requestHelper.delete.url('connection/delete/tableau').makeRequest();
  }
}

module.exports = new WorkbookConnection();
