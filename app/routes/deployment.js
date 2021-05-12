const Base = require('./base');
const validator = require('../middleware/validator/deployment');
const controller = require('../controllers/deployment');
const kc = require('../middleware/keycloak');
const parser = require('../middleware/parser');
const { deployment } = require('../common/constants').permissions;

class Deployment extends Base {
  constructor() {
    super();
    this.post('/deploy', kc.enforcer(deployment.create), validator.validateDeployApp, controller.deploy);
    this.post('/stop', kc.enforcer(deployment.delete), validator.validateStopApp, controller.stop);
    this.post('/shiny', kc.enforcer(deployment.create), parser.parseZipFolder, validator.validateDeployShiny, controller.deployShiny);
  }
}

module.exports = Deployment;
