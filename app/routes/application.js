const Base = require('./base');
const controller = require('../controllers/application');
const validator = require('../middleware/validator/application');
const parser = require('../middleware/parser');
const kc = require('../middleware/keycloak');
const { authz } = require('../common/constants');
const { app } = require('../common/constants').permissions;

class Application extends Base {
  constructor() {
    super();
    const enforcer = {
      resource: (req, res, next) => kc.enforcer(`${req.params.appId}:${authz[req.method]}`)(req, res, next),
      create: (req, res, next) => kc.enforcer(`${req.params.appId}:${authz[req.method]}`)(req, res, next),
      read: (req, res, next) => kc.enforcer(`${req.params.appId}:${authz[req.method]}`)(req, res, next),
      update: (req, res, next) => kc.enforcer(`${req.params.appId}:${authz[req.method]}`)(req, res, next),
      delete: (req, res, next) => kc.enforcer(`${req.params.appId}:${authz[req.method]}`)(req, res, next),
    };
    this.get('/', kc.enforcer(app.read), controller.getApplications);
    this.post('/', kc.enforcer(app.create), parser.parseAppFolder, validator.validateCreateApplication, controller.createApplication);
    this.get('/:appId', enforcer.read, validator.validateGetApplication, controller.getApplication);
    this.get('/:appId/scopes', enforcer.read, controller.getApplicationScopes);
    this.patch('/:appId', enforcer.update, validator.validateUpdateApplication, controller.updateApplication);
    this.post('/:appId/download', enforcer.read, validator.validateDownloadApplication, controller.downloadApplication);
    this.delete('/:appId', enforcer.delete, validator.validateDeleteApplication, controller.deleteApplication);
    this.get('/:appId/tags', enforcer.read, validator.validateGetTags, controller.getTags);
    this.get('/:appId/scripts', enforcer.read, validator.validateGetScripts, controller.getScripts);
    this.post('/:appId/scripts', enforcer.create, parser.parseZipFolder, validator.validateUploadScript, controller.uploadScript);
    this.delete('/:appId/scripts/:fileName', enforcer.delete, validator.validateDeleteScript, controller.deleteScript);
    this.post('/:appId/config', enforcer.create, parser.parseConfig, validator.validateUploadConfiguration, controller.uploadConfiguration);
  }
}

module.exports = Application;
