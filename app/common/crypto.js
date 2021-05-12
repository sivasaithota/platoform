const crypto = require('crypto');
const cryptoConfig = require('config').get('crypto');

class Crypto {
  /**
   * Crypto configuration
   * @returns {object} Object containing crypto configuration
   */
  static get config() {
    return cryptoConfig;
  }

  /**
   * Encrypts text based on crypto config algorithm and encoding
   * @param {string} key Encryption key
   * @param {string} text Plaintext to be encrypted
   * @return {string} Ciphertext generated from plaintext using encryption key
   */
  encrypt(key, text) {
    const cipher = crypto.createCipher(cryptoConfig.encryptionAlgorithm, key);
    let encrypted = cipher.update(text, cryptoConfig.encoding.text, cryptoConfig.encoding.cipher);
    encrypted += cipher.final(cryptoConfig.encoding.cipher);
    return encrypted;
  }

  /**
   * Decrypts text based on crypto config algorithm and encoding
   * @param {string} key Decryption key
   * @param {string} encrypted Ciphertext to be decrypted
   * @returns {string} Plaintext generated from ciphertext using decryption key
   */
  decrypt(key, encrypted) {
    const decipher = crypto.createDecipher(cryptoConfig.encryptionAlgorithm, key);
    let text = decipher.update(encrypted, cryptoConfig.encoding.cipher, cryptoConfig.encoding.text);
    text += decipher.final(cryptoConfig.encoding.text);
    return text;
  }
}

module.exports = Crypto;
