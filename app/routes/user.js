const Base = require('./base');
const controller = require('../controllers/user');
const kc = require('../middleware/keycloak');
const { user } = require('../common/constants').permissions;

class User extends Base {
  constructor() {
    super();
    this.get('/', kc.enforcer(user.read), controller.getUsers);
    this.get('/:userId', kc.enforcer(user.read), controller.getUser);
    this.patch('/:userId', kc.enforcer(user.update), controller.updateUser);
    this.delete('/', kc.enforcer(user.delete), controller.deleteUser);
    this.post('/', kc.enforcer(user.create), controller.createUser);
  }
}

module.exports = User;
