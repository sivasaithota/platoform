const environmentDataService = require('../../dataServices').environment;
const constants = require('../../common/constants');


class Environment {
  getEnvironments(name) {
    const types = constants.types.environment;
    return environmentDataService.getEnvironments({ name, type: { $in: [types.custom, types.default] } });
  }
}

module.exports = new Environment();
