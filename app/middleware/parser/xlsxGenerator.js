const config = require('config');

const RequestHelper = require('../../common/requestHelper');
const UniqueIdGenerator = require('../../common/uniqueIdGenerator');
const filer = require('../../common/filer');
const logger = require('../../common/logger');
const constants = require('../../common/constants');
const environmentDataService = require('../../dataServices').environment;

/**
 * XlsxGenerator contains methods that will call job processor to generate configs and scripts for enframe application using xlsx file
 */
class XlsxGenerator {
  /**
   * Generates scripts and configs by invoking job processor to run the xlxs deployer
   * @param {*} extractedPath points to the uploaded file dir
   * @param {*} fileName points to the uploaded file name
   */
  async generateXlsxConfig(token, extractedPath, fileName) {
    const xlsxFile = `${extractedPath}/${fileName}`;
    const uniqueId = new UniqueIdGenerator().getRandomId();
    const { internal } = constants.types.environment;
    const [environmentObject] = await environmentDataService.getEnvironments({ type: internal, internalName: 'XlsxGenerator' });
    const { workspace } = config.macros.xlsx;

    try {
      const url = `${config.jobprocessor.server + config.jobprocessor.path}/executions/xlsx`;
      const data = {
        workspace: uniqueId, enframeXlsxFile: xlsxFile, environmentObject,
      };

      // creates a temporary directory in a shared volume and copies script
      await filer.createDirectory(`${workspace}/${uniqueId}/generated`);
      await filer.copyFile(xlsxFile, `${workspace}/${uniqueId}/${xlsxFile}`);

      logger.info('Executing xlsx deployer via jobProcessor', data);

      await new RequestHelper('', {
        Authorization: `${token}`,
      }).url(url).post.data(data).makeRequest();
      logger.info('Successfully generated config and scripts for xlsx file');
      // if successful, copy the config and scripts to the uploaded app directory
      await filer.copyDirectory(`${workspace}/${uniqueId}/generated/Config`, `${extractedPath}/config`);
      await filer.copyDirectory(`${workspace}/${uniqueId}/generated/Scripts`, `${extractedPath}/ds`);
      await filer.copyDirectory(`${workspace}/${uniqueId}/generated/Inputs`, `${extractedPath}/input`);
      await filer.copyDirectory(`${workspace}/${uniqueId}/generated/Outputs`, `${extractedPath}/output`);

      // delete temporary directory
      await filer.deleteDirectory(`${workspace}/${uniqueId}`);
    } catch (err) {
      await filer.deleteDirectory(`${workspace}/${uniqueId}`);
      logger.error('Failed to generate scripts and configs for xlsx app', err);
      throw err.data ? err.data.error : err;
    }
  }
}

module.exports = new XlsxGenerator();
