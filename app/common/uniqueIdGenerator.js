const uuid = require('uuid');

class UniqueIDGenerator {
  /**
   * Get time-based v1 unique Id
   */
  getTimeBasedId() {
    return uuid.v1().replace();
  }

  /**
   * Get a randomly generated v4 UUID
   */
  getRandomId() {
    return uuid.v4();
  }
}
module.exports = UniqueIDGenerator;
