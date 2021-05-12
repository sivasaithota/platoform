const constants = require('./constants');

class ControllerHelper {
  constructor(res) {
    this._res = res;
  }

  /**
   * Sends response and result if available
   * @param {*} resObject Express response object
   */
  sendResponse(resObject) {
    this._res.status(this._validHttpCode(resObject.code) || constants.httpCodes.success).send(resObject.result);
  }

  /**
   * Sends error response
   * @param {*} resObject Express response object
   */
  sendErrorResponse(resObject) {
    this._res.status(this._validHttpCode(resObject.code) || constants.httpCodes.internalServerError).send(resObject.result);
  }

  _validHttpCode(code) {
    return constants.httpCodesList.indexOf(code) >= 0 ? code : null;
  }

  extractToken(req) {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
  }  
}

module.exports = ControllerHelper;
