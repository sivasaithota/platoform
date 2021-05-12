const path = require('path');

const filer = require('../../common/filer');
const helper = require('../../common/helper');
const constants = require('../../common/constants');
const ticdatGenerator = require('./ticdatGenerator');
const Scan = require('./scanner');
const xlsxGenerator = require('./xlsxGenerator');

class FolderParser {
  async _extractArchive(fileData) {
    const dirPath = `${fileData.path.replace('.zip', '')}_extracted`;
    await filer.extractFile(fileData.path, dirPath);
    await filer.deleteFile(fileData.path);
    return dirPath;
  }

  async parseAppFolderArchive(token, fileData, type = constants.types.appFormat.normal) {
    let configPaths = [];
    let tablePaths = [];
    let extractedPath = '';

    try {
      if (type === constants.types.appFormat.ticdat) {
        const fileName = path.basename(fileData.path);
        extractedPath = `/tmp/${helper.getRandomString(16)}`;
        await filer.createDirectory(extractedPath);
        await filer.moveFile(fileData.path, `${extractedPath}/${fileName}`);
        // Generate configs,scripts, inputs and outputs based on whether upload was xlsx or not
        if (fileData.path.endsWith('xlsx')) {
          await xlsxGenerator.generateXlsxConfig(token, extractedPath, fileName);
        } else {
          await ticdatGenerator.generateTicdatConfig(token, extractedPath, fileName);
        }
      } else {
        extractedPath = await this._extractArchive(fileData);
        // Rename the app sub-directories to internal naming system
        await Promise.all(Object.entries(constants.appFolderMap).map(async ([folderName, internalName]) => {
          const folderPath = `${extractedPath}/${folderName}`;
          if (await filer.pathExists(folderPath)) {
            await filer.rename(folderPath, `${extractedPath}/${internalName}`);
          }
        }));
      }

      if (await filer.pathExists(`${extractedPath}/ds`)) {
        const scan = new Scan();
        await scan.scanPython(token, `${extractedPath}/ds`);
      }
      // Get the file system tree for the extracted directory, and separate out the config file paths and table file paths
      const folderData = await filer.getDirectoryTree(extractedPath);

      folderData.directories = folderData.directories.filter((directory) => {
        const dirPath = path.basename(directory.path).toLocaleLowerCase();
        if (Object.values(constants.appFolderMap).includes(dirPath)) {
          if (path.basename(directory.path) === constants.appFolderMap.config) {
            configPaths = directory.files;
          } else {
            if (constants.types.table.includes(dirPath)) {
              tablePaths = [...tablePaths, ...directory.files];
            }
            return true;
          }
        }
        return false;
      });

      return { folderData, configPaths, tablePaths };
    } catch (err) {
      if (extractedPath) await filer.deleteDirectory(extractedPath);
      throw err;
    }
  }

  async parseFolderArchive(fileData) {
    const extractedPath = await this._extractArchive(fileData);
    const folderData = await filer.getDirectoryTree(extractedPath);

    return folderData;
  }
}

module.exports = new FolderParser();
