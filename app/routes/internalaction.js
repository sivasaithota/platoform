const Base = require('./base');
const controller = require('../controllers/action');
const validator = require('../middleware/validator/action');
const kc = require('../middleware/keycloak');

class InternalAction extends Base {
  constructor() {
    super();
    this.patch('/:actionId', kc.protect(), validator.validateUpdateAction, controller.updateAction);
  }
}

module.exports = InternalAction;
