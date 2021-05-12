const config = require('config');
const RequestHelper = require('../../common/requestHelper');
const UniqueIdGenerator = require('../../common/uniqueIdGenerator');
const filer = require('../../common/filer');
const logger = require('../../common/logger');
const constants = require('../../common/constants');
const environmentDataService = require('../../dataServices').environment;

/**
 * TicdatGenerator contains methods that will call job processor to generate configs and scripts for ticdat application
 */
class TicdatGenerator {
  /**
   * Generates scripts and configs by invoking job processor to run the ticdat deployer
   * @param {*} ticdatEngineFile points to the uploaded file
   */
  async generateTicdatConfig(token, ticdatEnginePath, ticdatEngineFile) {
    const uniqueId = new UniqueIdGenerator().getRandomId();
    const { workspace } = config.macros.ticdat;
    const { internal } = constants.types.environment;
    const [environmentObject] = await environmentDataService.getEnvironments({ type: internal, internalName: 'ticdat' });

    try {
      const url = `${config.jobprocessor.server + config.jobprocessor.path}/executions/ticdat`;
      const data = {
        workspace: uniqueId, engineFile: ticdatEngineFile, environmentObject,
      };

      // creates a temporary directory in a shared volume and copies script
      await filer.createDirectory(`${workspace}/${uniqueId}/generated`);
      await filer.copyFile(`${ticdatEnginePath}/${ticdatEngineFile}`, `${workspace}/${uniqueId}/${ticdatEngineFile}`);

      logger.info('Executing ticdat deployer via jobProcessor');

      await new RequestHelper('', {
        Authorization: `${token}`,
      }).url(url).post.data(data).makeRequest();

      logger.info('Successfully generated config and scripts for ticdat application');
      // if successful, copy the config and scripts to the uploaded app directory
      await filer.copyDirectory(`${workspace}/${uniqueId}/generated/Config`, `${ticdatEnginePath}/config`);
      await filer.copyDirectory(`${workspace}/${uniqueId}/generated/Scripts`, `${ticdatEnginePath}/ds`);
      // delete temporary directory
      await filer.deleteDirectory(`${workspace}/${uniqueId}`);
    } catch (err) {
      await filer.deleteDirectory(`${workspace}/${uniqueId}`);
      logger.error('Failed to generate scripts and configs for ticdat app', err);
      throw err.data ? err.data.error : err;
    }
  }
}

module.exports = new TicdatGenerator();
