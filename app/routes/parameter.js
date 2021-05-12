const Base = require('./base');
const validator = require('../middleware/validator/parameter');
const controller = require('../controllers/parameter');
const kc = require('../middleware/keycloak');
const { params } = require('../common/constants').permissions;

class Parameter extends Base {
  constructor() {
    super();
    this.get('/', kc.enforcer(params.read), validator.validateGetParameters, controller.getParameters);
    this.post('/:parameterGroupId/parameters', kc.enforcer(params.create), validator.validateCreateParameter, controller.createParameter);
    this.patch('/:parameterGroupId/parameters/:parameterId', kc.enforcer(params.update), validator.validateUpdateParameter, controller.updateParameter);
    this.delete('/parameters', kc.enforcer(params.delete), validator.validateDeleteParameters, controller.deleteParameters);
    this.post('/:parameterGroupId/moveParameters/', kc.enforcer(params.create), validator.validateMoveParameters, controller.moveParameters);
    this.post('/', kc.enforcer(params.create), validator.validateCreateParameterGroup, controller.createParameterGroup);
    this.patch('/:parameterGroupId', kc.enforcer(params.update), validator.validateUpdateParameterGroup, controller.updateParameterGroup);
    this.delete('/:parameterGroupId', kc.enforcer(params.delete), validator.validateDeleteParameterGroup, controller.deleteParameterGroup);
    this.post('/:parameterGroupId/move', kc.enforcer(params.update), validator.validateMoveParameterGroup, controller.moveParameterGroup);
  }
}

module.exports = Parameter;
