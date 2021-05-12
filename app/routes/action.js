const Base = require('./base');
const controller = require('../controllers/action');
const validator = require('../middleware/validator/action');
const kc = require('../middleware/keycloak');
const { actions } = require('../common/constants').permissions;

class Action extends Base {
  constructor() {
    super();
    this.get('/', kc.enforcer(actions.read), validator.validateGetActions, controller.getActions);
    this.post('/', kc.enforcer(actions.create), validator.validateCreateAction, controller.createAction);
    this.patch('/:actionId', kc.enforcer(actions.update), validator.validateUpdateAction, controller.updateAction);
    this.delete('/:actionId', kc.enforcer(actions.delete), validator.validateDeleteAction, controller.deleteAction);
    this.post('/:actionId/move', kc.enforcer(actions.create), validator.validateMoveAction, controller.moveAction);
    this.get('/triggers', kc.enforcer(actions.read), validator.validateGetTriggers, controller.getTriggers);
    this.post('/triggers', kc.enforcer(actions.create), validator.validateSetTrigger, controller.setTrigger);
  }
}

module.exports = Action;
