const axios = require('axios');
const oauth = require('axios-oauth-client');
const tokenProvider = require('axios-token-interceptor');
const keycloakConfig = require('config').get('keycloak');

class RequestHelper {
  /**
   * Create a new requestHelper Object containing axios global settings
   * @param {string} [baseURL] Base url to be considered for every request made using the object
   * @param {object} [headers] Global headers to be used for different kinds of requests
   */
  constructor(baseURL, headers) {
    this._axios = axios.create({ baseURL, headers });
    this._axios.interceptors.request.use(
      oauth.interceptor(tokenProvider, oauth.client(axios.create(), keycloakConfig.serviceAccount)),
    );
    this._config = {};
  }

  /**
   * Internal function for abstracting assignment of axios config data
   * @param {string} key Axios request config key
   * @param {string} value Axios request config value
   */
  _setConfig(key, value) {
    this._config[key] = value;
    return this;
  }

  /**
   * Set URL for the current request to be made
   * @param {string} url Request URL
   */
  url(url) {
    return this._setConfig('url', url);
  }

  /**
   * Specify that the current request should use GET method
   */
  get get() {
    return this._setConfig('method', 'get');
  }

  /**
    * Specify that the current request should use POST method
    */
  get post() {
    return this._setConfig('method', 'post');
  }

  /**
  * Specify that the current request should use POST method
  */
   get put() {
    return this._setConfig('method', 'put');
  }

  /**
    * Specify that the current request should use POST method
    */
  get delete() {
    return this._setConfig('method', 'delete');
  }

  /**
   * Set query parameters for the current request
   * @param {object} params Request params
   */
  params(params) {
    return this._setConfig('params', params);
  }

  /**
   * Set request data for the current request
   * @param {object} data Request data
   */
  data(data) {
    return this._setConfig('data', data);
  }

  /**
   * Make a request using the current request config and provided config, and then clear all request config
   * @param {object} [config]
   * @returns {Promise<object>} Promise that resolves to response
   */
  async makeRequest(config = {}) {
    const response = await this._axios({ ...this._config, ...config });
    this._config = {};
    return response;
  }
}

module.exports = RequestHelper;
