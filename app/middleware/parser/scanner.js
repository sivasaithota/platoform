const config = require('config');
const fs = require('fs');

const RequestHelper = require('../../common/requestHelper');
const UniqueIdGenerator = require('../../common/uniqueIdGenerator');
const filer = require('../../common/filer');
const logger = require('../../common/logger');
const constants = require('../../common/constants');
const environmentDataService = require('../../dataServices').environment;


class Scanner {
  constructor() {
    this.uniqueId = new UniqueIdGenerator().getRandomId();
    this.banditFile = false;
    this.workspace = `${config.macros.scan.workspace}/${this.uniqueId}`;
  }

  async scanPython(token, scriptDirectory, details = []) {
    const url = `${config.jobprocessor.server + config.jobprocessor.path}/executions/scan`;
    const { internal } = constants.types.environment;
    const [environmentObject] = await environmentDataService.getEnvironments({ type: internal, internalName: 'scanner' });
    try {
      const stats = fs.statSync(scriptDirectory);
      if (!stats.isDirectory()) {
        await filer.copyFile(scriptDirectory, `${this.workspace}/${details[1]}`);
      } else {
        if (await filer.pathExists(`${scriptDirectory}/exception.ini`)) {
          this.banditFile = true;
        }
        await filer.copyDirectory(scriptDirectory, `${this.workspace}`);
      }
      if (details.length && !this.banditFile) {
        const iniPath = `${constants.fs.paths.appRoot}/${details[0]}/${constants.appFolderMap.scripts}/exception.ini`;
        if (await filer.pathExists(iniPath)) {
          this.banditFile = true;
          await filer.copyFile(iniPath, `${this.workspace}/exception.ini`);
        }
      }
      const data = {
        workspace: this.uniqueId, iniPath: this.banditFile, environmentObject,
      };
      logger.info('Executing scanner via jobProcessor', data);

      await new RequestHelper('', {
        Authorization: `${token}`,
      }).url(url).post.data(data).makeRequest();
      await filer.deleteDirectory(`${this.workspace}`);
    } catch (err) {
      logger.error('Failed to scan application scripts', err);
      await filer.deleteDirectory(`${this.workspace}`);
      throw err.data ? err.data.error : err;
    }
  }
}

module.exports = Scanner;
