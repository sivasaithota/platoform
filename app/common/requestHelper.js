const got = require('got');
const stream = require('stream');
const fs = require('fs');
const { promisify } = require('util');

const pipeline = promisify(stream.pipeline);

const hooks = {
  afterResponse: [
    (response) => {
      if (response.headers['content-type'].includes('json')) response.data = JSON.parse(response.body);
      return response;
    },
  ],
  beforeError: [
    (error) => {
      const { response } = error;
      if (response.headers['content-type'].includes('json')) response.data = JSON.parse(response.body);
      return error;
    },
  ],
};

class RequestHelper {
  /**
   * Create a new requestHelper Object containing axios global settings
   * @param {string} prefixUrl Base url to be considered for every request made using the object
   * @param {object} headers Global headers to be used for different kinds of requests
   */
  constructor(prefixUrl, headers) {
    this._client = got.extend({ prefixUrl, headers, hooks });
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
    // Remove leading backslashes
    const path = this._client.defaults.options.prefixUrl ? url.replace(/^\/*/, '') : url;
    return this._setConfig('url', path);
  }

  /**
   * Specify that the current request should use GET method
   */
  get get() {
    return this._setConfig('method', 'get');
  }

  /**
   * Specify that the current request should use GET method
   */
  get put() {
    return this._setConfig('method', 'put');
  }

  /**
   * Specify that the current request should use DELETE method
   */
  get delete() {
    return this._setConfig('method', 'delete');
  }

  /**
 * Specify that the current request should use PUT method
 */
  get put() {
    return this._setConfig('method', 'put');
  }

  /**
    * Specify that the current request should use POST method
    */
  get post() {
    return this._setConfig('method', 'post');
  }

  /**
   * Set headers for the current request
   * @param {object} headers Request headers
   */
  headers(headers) {
    return this._setConfig('headers', headers);
  }

  /**
   * Set query parameters for the current request
   * @param {object} params Request params
   */
  params(params) {
    return this._setConfig('searchParams', params);
  }

  /**
   * Set request data for the current request
   * @param {object} data Request data
   */
  data(data) {
    if (data.constructor === Object) return this._setConfig('json', data);
    return this._setConfig('body', data);
  }

  /**
   * Make a request using the current request config and provided config, and then clear all request config
   * @param {object} [config]
   * @returns {Promise<object>} Promise that resolves to response
   */
  async makeRequest(config = {}) {
    config = { ...this._config, ...config };
    this._config = {};

    try {
      const response = await this._client(config);
      return response;
    } catch (err) {
      const errorObject = err.response ? {
        status: err.response.statusCode,
        data: err.response.data,
      } : err.message;
      throw errorObject;
    }
  }

  /**
   * Download a file and return the downloaded file path
   * @param {string} [path] path to file to be downloaded, if no path given use temporary path
   * @returns {Promise<String>} Promise that resolves to response
   */
  async downloadFile(path) {
    const filePath = path || `/tmp/${Date.now().toString()}`;
    const config = { ...this._config, isStream: true };
    this._config = {};

    try {
      await pipeline(
        this._client(config),
        fs.createWriteStream(filePath),
      );
      return filePath;
    } catch (err) {
      const errorObject = err.response ? {
        status: err.response.statusCode,
        data: err.response.body,
      } : err.message;
      throw errorObject;
    }
  }
}

module.exports = RequestHelper;
