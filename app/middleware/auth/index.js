const keycloakConfig = require('config').get('keycloak');

const globalDataService = require('../../dataServices').global;
const ControllerHelper = require('../../common/controllerHelper');
const { httpCodes, roles, authentication } = require('../../common/constants');
const logger = require('../../common/logger');

class Auth {
  async setUser(req, res, next) {
    try {
      req.user = req.kauth.grant.access_token.content;
      req.user.username = req.user.email;
      // Service account in keycloak doesn't have username and email.
      if (req.user.preferred_username.startsWith('service-account')) {
        req.user.username = 'admin@opexanalytics.com'; // This is needed now to support initial setup flows
      }
    } catch {
      logger.error('Something went wrong while processing JWT token');
      return new ControllerHelper(res).sendErrorResponse({
        code: httpCodes.redirect,
        result: {
          message: authentication.invalidJWT,
        },
      });
    }
    if (!req.user.roles) {
      logger.error('User does not have valid roles');
      return new ControllerHelper(res).sendErrorResponse({
        code: httpCodes.redirect,
        result: {
          message: authentication.noRoles,
        },
      });
    }
    req.user.isAdmin = (roles.adminRoles
      .some(adminRole => req.user.roles.includes(adminRole)) || req.user.preferred_username.startsWith('service-account'));
    const result = await globalDataService.getSetting('acceptedDomains');
    if (req.user.username && !result.acceptedDomains.some(domain => req.user.username.endsWith(domain))) {
      res.clearCookie('sessionId');
      res.redirect(keycloakConfig.logoutUrl);
      return new ControllerHelper(res).sendErrorResponse({
        code: httpCodes.redirect,
        result: {
          message: authentication.unauthorizedDomain,
        },
      });
    }
    next();
  }
}

module.exports = new Auth();
