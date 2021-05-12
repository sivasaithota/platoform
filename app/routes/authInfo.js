const Base = require('./base');
const controller = require('../controllers/authInfo');

class Theme extends Base {
  constructor() {
    super();
    this.get('/', controller.getAuthInfo);
  }
}

module.exports = Theme;
