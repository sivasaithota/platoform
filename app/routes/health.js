const Base = require('./base');
const controller = require('../controllers/health');

class Health extends Base {
  constructor() {
    super();
    this.get('/', controller.checkHealth);
  }
}

module.exports = Health;
