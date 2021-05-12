const Base = require('./base');
const ApplicationRouter = require('./application');
const ActionRouter = require('./action');
const InternalActionRouter = require('./internalaction');
const AuthRouter = require('./authInfo');
const DeploymentRouter = require('./deployment');
const EnvironmentRouter = require('./environment');
const GlobalRouter = require('./global');
const HealthRouter = require('./health');
const ParameterRouter = require('./parameter');
const ReportRouter = require('./report');
const ScheduleRouter = require('./schedule');
const SharingRouter = require('./sharing');
const TableRouter = require('./table');
const ThemeRouter = require('./theme');
const UserRouter = require('./user');
const auth = require('../middleware/auth');
const kc = require('../middleware/keycloak');
const { authz } = require('../common/constants');

class Routes extends Base {
  constructor() {
    super();
    const enforcer = {
      resourceAccess: (req, res, next) => kc.enforcer(`${req.params.appId}:${authz[req.method]}`)(req, res, next),
    };
    this.use(kc.middleware());
    this.use('/api/v1/apps/:appId/schedules', enforcer.resourceAccess, auth.setUser, new ScheduleRouter());
    this.use('/api/v1/apps/:appId/reports', enforcer.resourceAccess, auth.setUser, new ReportRouter());
    this.use('/api/v1/apps/:appId/tables', enforcer.resourceAccess, auth.setUser, new TableRouter());
    this.use('/api/v1/apps/:appId/parameterGroups', enforcer.resourceAccess, auth.setUser, new ParameterRouter());
    this.use('/api/v1/apps/:appId/deployment', enforcer.resourceAccess, auth.setUser, new DeploymentRouter());
    this.use('/api/v1/apps/:appId/share', enforcer.resourceAccess, auth.setUser, new SharingRouter());
    this.use('/api/v1/apps/:appId/actions', enforcer.resourceAccess, auth.setUser, new ActionRouter());
    this.use('/api/v1/themes', new ThemeRouter());
    this.use('/api/v1/authinfo', new AuthRouter());
    this.use('/api/v1/health', new HealthRouter());
    this.use('/api/v1/environment', auth.setUser, new EnvironmentRouter());
    this.use('/api/v1/apps', auth.setUser, new ApplicationRouter());
    this.use('/api/v1/users', auth.setUser, new UserRouter());
    this.use('/api/v1', auth.setUser, new GlobalRouter());
    this.use('/internal/api/v1/apps/:appId/actions', kc.protect(), auth.setUser, new InternalActionRouter());
  }
}

module.exports = Routes;
