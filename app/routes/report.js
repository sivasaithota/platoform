const Base = require('./base');
const controller = require('../controllers/report');
const validator = require('../middleware/validator/report');
const kc = require('../middleware/keycloak');
const { reports } = require('../common/constants').permissions;

class Report extends Base {
  constructor() {
    super();
    this.get('/', kc.enforcer(reports.read), validator.validateGetReports, controller.getReports);
    this.post('/', kc.enforcer(reports.create), validator.validateCreateReport, controller.createReport);
    this.patch('/:reportId', kc.enforcer(reports.update), validator.validateUpdateReport, controller.updateReport);
    this.delete('/:reportId', kc.enforcer(reports.delete), validator.validateDeleteReport, controller.deleteReport);
    this.get('/:reportId/logs', kc.enforcer(reports.read), validator.validateGetLogs, controller.getLogs);
  }
}

module.exports = Report;
