const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Crypto = require('../common/crypto');
const logger = require('../common/logger');

class Helper {
  constructor() {
    this._passwordSources = {
      numeric: '0123456789',
      alphaLower: 'abcdefghijklmnopqrstuvwxyz',
      alphaUpper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      special: '!#$%&()*+,-./:;<=>?@{|}~',
    };
  }

  /**
   * Generates a string of random characters
   * @param {integer} length String length
   * @param {string} [source] A string containing all possible characters that can be part of the random string
   * @return {string} String of randomly generated characters
   */
  getRandomString(length, sources) {
    sources = sources || [this._passwordSources.numeric, this._passwordSources.alphaLower, this._passwordSources.alphaUpper];
    const sourceString = sources.constructor === Array ? sources.join('') : sources;
    let result = '';
    for (let i = length; i > 0; i -= 1) {
      result += sourceString[Math.round(Math.random() * (sourceString.length - 1))];
    }
    return result;
  }

  /**
   * Generates a password with at least one uppercase, lowercase, numeric and special character each
   * @param {number} minLength Minimum password length
   * @returns {string} Password that satisfies the minimum length
   */
  generatePassword(minLength) {
    let result = this.getRandomString(Math.ceil(minLength * 0.15), this._passwordSources.numeric)
      + this.getRandomString(Math.ceil(minLength * 0.35), this._passwordSources.alphaLower)
      + this.getRandomString(Math.ceil(minLength * 0.35), this._passwordSources.alphaUpper)
      + this.getRandomString(Math.ceil(minLength * 0.15), this._passwordSources.special);
    let scrambled = '';

    for (let i = minLength - 1; i >= 0; i -= 1) {
      const index = Math.random() * i;
      scrambled += result.charAt(index);
      result = result.substr(0, index) + result.substr(index + 1);
    }

    return scrambled;
  }

  /**
   * Get a deep copy of an object
   * @param {object} object The object to be copied
   * @return {object} Deep copy of the provided object
   */
  getDeepCopy(object) {
    const result = {};
    Object.entries(object).forEach(([name, value]) => {
      result[name] = value.constructor === Object ? this.getDeepCopy(value) : value;
    });
    return result;
  }

  /**
   * Encrypts password based on key
   * @param {*} key Key used for encrypting password
   * @param {*} text Password text
   * @return {string} Encrypted password
   */
  encryptPassword(key, text) {
    return new Crypto().encrypt(Crypto.config.secretKeys.password + key.toLocaleLowerCase(), text);
  }

  /**
   * Decrypts password based on key
   * @param {*} key Key used for decrypting password
   * @param {*} text Encrypted password text
   * @return {string} Decrypted password
   */
  decryptPassword(key, encrypted) {
    return new Crypto().decrypt(Crypto.config.secretKeys.password + key.toLocaleLowerCase(), encrypted);
  }

  /**
   * Flattens all the multi-level properties in an object to '.' separated property names, all in a single level
   * Example:
   *
   *    {
   *      user: {
   *        name: 'UserA',
   *        roles: ['Admin', 'Owner']
   *      }
   *    }
   * Flattens to:
   *
   *    {
   *      user.name: 'UserA',
   *      user.roles.0: 'Admin',
   *      user.roles.1: 'Owner'
   *    }
   * @param {*} object Object to be flattened
   * @param {*} keyPrefix Prefix to be added to every property of object, if any
   * @return {*} Flattened object
   */
  flattenObject(object, keyPrefix = '') {
    const result = {};
    Object.keys(object).forEach((propertyName) => {
      const value = object[propertyName];
      if (value != null && value.constructor === Object) {
        Object.assign(result, this.flattenObject(value, `${keyPrefix}${propertyName}.`));
      } else {
        result[`${keyPrefix}${propertyName}`] = value;
      }
    });
    return result;
  }

  /**
  * Dumps a postgres database to a binary dump file
  * @param {string} dumpFilePath Path of dump file
  * @param {*} databaseDetails Database details including servername, port, username, password and databaseName
  * @return {Promise<void>} Promise that resolves once dump has been generated
  */
  async generatePostgresDump(dumpFilePath, databaseDetails, schemasList = []) {
    const schemasCmd = schemasList.length ? schemasList.map(schema => ` -n '${schema}' `).join(' ')
      : '-T \'master_*\' -T \'run_histories\'';
    const cmd = `export PGPASSWORD='${databaseDetails.password}' PGUSER='${databaseDetails.username}' `
      + ` PGHOST='${databaseDetails.serverName}' PGDATABASE='${databaseDetails.databaseName}'; `
      + ` pg_dump -p ${databaseDetails.port} -b --format=c ${schemasCmd} > ${dumpFilePath}`;

    logger.info('Generating postgres dump', cmd);
    await exec(cmd);
    logger.debug('Postgres dump generated successfully');
  }

  /**
  * Dumps a mongodb database to a binary dump file
  * @param {string} dumpFilePath Path of dump file
  * @param {*} databaseDetails Database details including host, port, username, password and dbname
  * @param {string[]} [collections] List of collection names that need to be backed up
  * @param {string} [query] Query to be used for selectively backing up collections
  * @return {Promise<void>} Promise that resolves once dump has been generated
  */
  async generateMongoDump(dumpFilePath, databaseDetails, collections, query) {
    let command = `mongodump --host ${databaseDetails.host}:${databaseDetails.port} -u ${databaseDetails.username}`
    + ` -p '${databaseDetails.password}' -d ${databaseDetails.dbname}`;
    logger.info('Generating mongodb dump', command);
    if (!collections) {
      command += ` -o ${dumpFilePath}`;
      return exec(command);
    }
    if (query) {
      command += ` -q ${query}`;
    }
    await Promise.all(
      Object.values(collections).map(collection => exec(`${command} -c ${collection} -o ${dumpFilePath}`)),
    );
    logger.debug('Mongodb dump generated successfully');
  }

  /**
   * Generate and fetch audit properties for a user when creating or updating documents in database
   * @param {string} username Username against which audit data is to be created
   * @param {boolean} [isExisting] Indicates whether object already exists - if so, creation Data is omitted
   */
  getAuditProperties(username, isExisting = false) {
    const now = new Date();
    return {
      ...(!isExisting ? {
        createdBy: username,
        createdAt: now,
      } : {}),
      updatedBy: username,
      updatedAt: now,
    };
  }

  /**
   * Parse table/column display name to a normalize view
   * @param {string} table/column name
   */
  parseName(name) {
    // Replace underscore and dash with space
    name = name.replace(/([^_|\s].*?)_(?=[^_|^s])/g, '$1 ');
    // Change case of first character of every new word to Upper Case
    return name.replace(/(^|\s)[a-z]/g, (letter) => {
      return letter.toUpperCase();
    });
  }
}
module.exports = new Helper();
