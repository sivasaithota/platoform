const Base = require('./base');
const controller = require('../controllers/sharing');
const kc = require('../middleware/keycloak');
const { sharing } = require('../common/constants').permissions;

class Share extends Base {
  constructor() {
    super();
    this.post('/', kc.enforcer(sharing.create), controller.addShare);
    this.patch('/', kc.enforcer(sharing.update), controller.updateShare);
    this.delete('/', kc.enforcer(sharing.delete), controller.removeShare);
    this.get('/users', kc.enforcer(sharing.read), controller.getSharedUsers);
    this.get('/users/count', kc.enforcer(sharing.read), controller.getSharedUserCount);
  }
}

module.exports = Share;
