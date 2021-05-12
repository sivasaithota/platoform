const Base = require('./base');
const controller = require('../controllers/theme');
const validator = require('../middleware/validator/theme');
const parser = require('../middleware/parser');
const auth = require('../middleware/auth');
const kc = require('../middleware/keycloak');
const { theme } = require('../common/constants').permissions;

class Theme extends Base {
  constructor() {
    super();
    this.get('/', controller.getThemes);
    this.post('/', kc.enforcer(theme.create), auth.setUser, parser.parseZipFolder, validator.validateCreateTheme, controller.createTheme);
    this.patch('/:themeId', kc.enforcer(theme.update), auth.setUser, validator.validateUpdateTheme, controller.updateTheme);
    this.delete('/:themeId', kc.enforcer(theme.delete), auth.setUser, validator.validateDeleteTheme, controller.deleteTheme);
    this.get('/:themeId/images', validator.validateGetThemeImage, controller.getThemeImage);
    this.patch('/:themeId/images', kc.enforcer(theme.update), auth.setUser, parser.parseMultipart, validator.validateUpdateThemeImage, controller.updateThemeImage);
  }
}

module.exports = Theme;
