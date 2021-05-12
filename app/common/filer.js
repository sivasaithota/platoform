const fs = require('fs');
const path = require('path');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

const logger = require('./logger');
const constants = require('./constants');

class Filer {
  /**
   *
   * Checks if a file exists
   * @param {string} filePath File path to be checked
   * @return {Promise<boolean>} Promise that resolves to true/false
   */
  pathExists(filePath) {
    return new Promise((resolve) => {
      fs.access(filePath, err => resolve(!err));
    });
  }

  /**
   *
   * Checks if a file exists
   * @param {string} filePath File path to be checked
   * @return {Promise<boolean>} Promise that resolves to an object with stats
   */
  getStats(filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) return reject(err);
        return resolve(stats);
      });
    });
  }

  /**
   * Renames/Moves a file from one given path to another
   * @param {string} fromPath Original file path
   * @param {string} toPath File path to be renamed/moved to
   * @return {Promise<void>} Promise that resolves once file is renamed
   */
  rename(fromPath, toPath) {
    return new Promise((resolve, reject) => {
      fs.rename(fromPath, toPath, (err) => {
        if (err) {
          logger.warning('Error renaming path', err);
          return reject(err);
        }

        resolve();
      });
    });
  }

  /**
   * Deletes the file at the provided path
   * @param {string} filePath Path of file to be deleted
   * @return {Promise<boolean>} Promise that resolves to true/false depending on whether file was deleted
   */
  deleteFile(filePath) {
    return new Promise((resolve) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          logger.warning('Error deleting file', err);
          return resolve(false);
        }

        resolve(true);
      });
    });
  }

  /**
   * Creates an empty directory if it does not already exist, and does nothing if a file exists at the path
   * @param {string} dirPath Path of directory to be deleted
   * @return {Promise<void>} Promise that resolves once the directory has been created
   */
  async createDirectory(dirPath) {
    if (await this.pathExists(dirPath)) return;
    await this.createDirectory(path.dirname(dirPath));

    return new Promise((resolve, reject) => {
      fs.mkdir(dirPath, async (err) => {
        if (err && err.code !== 'EEXIST') {
          logger.error('Error creating directory', err);
          return reject(constants.file.createDirectoryError);
        }
        resolve();
      });
    });
  }

  /**
   * Gets a tree of all files and directories within the directory
   * @param {string} dirPath Path of directory whose tree is to be fetched
   * @return {Promise<object>} Promise that resolves to the directory tree object
   */
  getDirectoryTree(dirPath) {
    const tree = {
      path: dirPath,
      directories: [],
      files: [],
    };

    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, (readErr, fileNames) => {
        if (readErr) return reject(readErr);

        let pendingLength = fileNames.length;
        if (!pendingLength) return resolve(tree);
        fileNames.forEach((fileName) => {
          const filePath = `${dirPath}/${fileName}`;

          fs.stat(filePath, async (statErr, stats) => {
            if (statErr) return reject(statErr);

            if (stats.isDirectory()) {
              const dirTree = await this.getDirectoryTree(filePath);
              tree.directories.push(dirTree);
            } else if (stats.isFile()) {
              tree.files.push(filePath);
            }

            pendingLength -= 1;
            if (!pendingLength) return resolve(tree);
          });
        });
      });
    });
  }

  /**
   * Deletes the directory along with all its contents
   * @param {string} dirPath Path of directory to be deleted
   * @return {Promise<void>} Promise that resolves once the directory and its contents have been deleted
   */
  async deleteDirectory(dirPath) {
    const dirTree = await this.getDirectoryTree(dirPath);
    await Promise.all([
      ...dirTree.files.map(async (filePath) => this.deleteFile(filePath)),
      ...dirTree.directories.map(async (directory) => this.deleteDirectory(directory.path)),
    ]);
    return new Promise((resolve) => {
      fs.rmdir(dirPath, (err) => {
        if (err) {
          logger.warning('Error deleting directory', err);
          return resolve(false);
        }
        resolve(true);
      });
    });
  }

  /**
   * Copies a file to a different location
   * @param {string} fromPath Path of file to be copied
   * @param {string} toPath Destination path for file to be copied to
   * @return {Promise<void>} Promise that resolves once the file has been copied
   */
  async copyFile(fromPath, toPath) {
    await this.createDirectory(path.dirname(toPath));

    return new Promise((resolve, reject) => {
      fs.copyFile(fromPath, toPath, (copyErr) => {
        if (copyErr) {
          logger.error('Error copying file', copyErr);
          return reject(constants.file.copyError);
        }

        resolve();
      });
    });
  }

  /**
   * Copies a directory and its contents to a different location
   * @param {string} fromPath Path of directory to be copied
   * @param {string} toPath Destination path for directory to be copied to
   * @return {Promise<void>} Promise that resolves once the directory and its contents has been copied
   */
  async copyDirectory(fromPath, toPath) {
    if (fromPath === toPath) {
      return;
    }

    const dirTree = await this.getDirectoryTree(fromPath);
    await this.createDirectory(toPath);

    await Promise.all([
      ...dirTree.files.map(async (filePath) => this.copyFile(filePath, filePath.replace(fromPath, toPath))),
      ...dirTree.directories.map(async (directory) => this.copyDirectory(directory.path, directory.path.replace(fromPath, toPath))),
    ]);
  }

  /**
   * Moves a file to a different location
   * @param {string} fromPath Path of file to be moved
   * @param {string} toPath Destination path for file to be moved to
   * @param {boolean} deleteOnFailure Flag to indicate if file should be deleted if move fails
   * @return {Pomise<undefined>} Promise that resolves once the file has been moved
   */
  async moveFile(fromPath, toPath, deleteOnFailure = false) {
    try {
      await this.copyFile(fromPath, toPath);
      await this.deleteFile(fromPath);
    } catch (err) {
      logger.error('Error moving file', err);
      if (deleteOnFailure) await this.deleteFile(fromPath);
      throw err;
    }
  }

  /**
   * Moves a directory to a different location
   * @param {string} fromPath Path of directory to be moved
   * @param {string} toPath Destination path for directory to be moved to
   * @param {boolean} deleteOnFailure Flag to indicate if directory should be deleted if move fails
   * @return {Pomise<undefined>} Promise that resolves once the directory has been moved
   */
  async moveDirectory(fromPath, toPath, deleteOnFailure = false) {
    try {
      await this.copyDirectory(fromPath, toPath);
      await this.deleteDirectory(fromPath);
    } catch (err) {
      logger.error('Error moving directory', err);
      if (deleteOnFailure) await this.deleteDirectory(fromPath);
      throw err;
    }
  }

  /**
   * Extracts the contents of the archive to the target location
   * @param {string} fromPath Path of archive to be extracted
   * @param {string} toPath Destination path for archive to be extracted to
   * @param {string} [folderToExtract] Name of specific folder within archive to be extracted, defaults to all folders
   * @return {Promise<void>} Promise that resolves once the archive has been extracted
   */
  async extractFile(fromPath, toPath = '.', folderToExtract) {
    try {
      if (folderToExtract) {
        await exec(`unzip '${fromPath}' '${folderToExtract}/*' -d '${toPath}'`);
      } else {
        await exec(`unzip '${fromPath}' -d '${toPath}'`);
      }
    } catch (err) {
      logger.error('Error extracting file', err);
      throw constants.file.extractError;
    }
  }

  /**
   * Compresses files and folders to a new or existing archive
   * @param {string} archivePath Path of archive to be compressed to
   * @param {string[]} filePaths Paths of files and directories to compress into the archive
   * @return {Promise<void>} Promise that resolves once all the files and directories have been compressed
   */
  async compressToArchive(archivePath, ...filePaths) {
    try {
      for (let i = 0; i < filePaths.length; i += 1) {
        const cmd = `pushd '${path.dirname(filePaths[i])}' && zip -urm '${archivePath}' './${path.basename(filePaths[i])}' && popd`;
        await exec(cmd, { shell: '/bin/bash' });
      }
    } catch (err) {
      logger.error('Error compressing files', err);
      throw err;
    }
  }

  /**
   * Writes data to the file
   * @param {string} filePath Path of file to be written to
   * @param {string} data Data to be written to the file
   * @param {string} encoding File encoding
   * @return {Promise<void>} Promise that resolves once the file has been written to
   */
  writeFile(filePath, data, encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, encoding, (err) => {
        if (err) {
          logger.error('Error writing file', err);
          reject(constants.file.writeError);
        }

        resolve();
      });
    });
  }

  /**
   * Reads a file and returns its contents
   * @param {string} filePath Path of file to be read
   * @param {string} [encoding] Encoding of file to be read, defaults to 'utf8'
   * @return {Promise<string>} Promise that resolves to the data read from the file
   */
  readFile(filePath, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
          logger.error('Error reading file', err);
          reject(constants.file.readError);
        }

        resolve(data);
      });
    });
  }
}

module.exports = new Filer();
