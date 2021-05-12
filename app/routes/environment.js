const Base = require('./base');
const controller = require('../controllers/environment');
const validator = require('../middleware/validator/environment');
const kc = require('../middleware/keycloak');
const { global, app } = require('../common/constants').permissions;

class Environment extends Base {
  constructor() {
    super();
    this.get('/:type', kc.enforcer(app.read), validator.validateGetEnvironments, controller.getEnvironments);
    this.post('/', kc.enforcer(global.create), validator.validateCreateEnvironment, controller.createEnvironment);
    this.patch('/:id', kc.enforcer(global.update), validator.validateUpdateEnvironment, controller.updateEnvironment);
    this.delete('/:id', kc.enforcer(global.delete), validator.validateDeleteEnvironment, controller.deleteEnvironment);
  }
}

module.exports = Environment;
