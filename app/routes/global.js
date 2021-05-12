const Base = require('./base');
const controller = require('../controllers/global');
const validator = require('../middleware/validator/global');
const kc = require('../middleware/keycloak');
const { global, app } = require('../common/constants').permissions;

class Global extends Base {
  constructor() {
    super();
    this.get('/datatypes', kc.enforcer(app.read), controller.getDatatypes);
    this.get('/parameterTypes', kc.enforcer(app.read), controller.getParameterTypes);
    this.get('/reportTypes', kc.enforcer(app.read), controller.getReportTypes);
    this.get('/info', kc.enforcer(app.read), controller.getInfo);
    this.get('/checkUnique/:type', kc.enforcer(app.read), validator.validateGetCheckUnique, controller.getCheckUnique);
    this.get('/setting', kc.enforcer(global.read), controller.getSetting);
    this.patch('/setting', kc.enforcer(global.update), validator.validateSetting, controller.updateSetting);
    this.get('/roles', kc.enforcer(global.read), controller.getRoles);
  }
}

module.exports = Global;
