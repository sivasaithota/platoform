const themeDataService = require('../../dataServices').theme;
const logger = require('../../common/logger');
const filer = require('../../common/filer');
const helper = require('../../common/helper');
const constants = require('../../common/constants');

class Theme {
  async getThemes() {
    logger.debug('Executing query to get the list of themes');
    try {
      const result = await themeDataService.getThemes();
      logger.debug('Retreived result from the database');
      return result;
    } catch (err) {
      logger.error('Error while getting themes', err);
      throw err;
    }
  }

  async createTheme(themeObject, userObject) {
    const folderPath = themeObject.folderData ? themeObject.folderData.path : null;
    delete themeObject.folderData;

    themeObject.createdBy = userObject.username;
    themeObject.createdAt = new Date();

    logger.debug('Executing query to create the theme');
    try {
      const result = await themeDataService.createTheme(themeObject);
      const themeFolder = `${constants.fs.paths.appRoot}/${constants.fs.directories.enframe.images.theme}/${result.insertedId}`;
      // If image folder was uploaded, move all the images from the uploaded path to image folder
      if (folderPath) {
        await filer.createDirectory(themeFolder);
        await Promise.all(
          Object.values(themeObject.images).map((fileName) => {
            return filer.moveFile(
              `${folderPath}/${fileName}`,
              `${constants.fs.paths.appRoot}/${constants.fs.directories.enframe.images.theme}/${result.insertedId}/${fileName}`,
            );
          }),
        );
      }
      logger.debug('Successfully created the theme in the database');
      return {
        id: result.insertedId,
      };
    } catch (err) {
      logger.error('Error while creating theme', err);
      throw err;
    }
  }

  async updateTheme(paramsObject, themeObject, userObject) {
    themeObject.updatedBy = userObject.username;
    themeObject.updatedAt = new Date();

    logger.debug('Executing query to update the theme');
    try {
      const result = await themeDataService.updateTheme(paramsObject.themeId, helper.flattenObject(themeObject));
      logger.debug('Successfully updated the theme in the database');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while creating theme', err);
      throw err;
    }
  }

  async deleteTheme(paramsObject) {
    logger.debug('Executing query to delete the theme');
    try {
      const result = await themeDataService.deleteTheme(paramsObject.themeId);
      await filer.deleteDirectory(`${constants.fs.paths.appRoot}/${constants.fs.directories.enframe.images.theme}/${paramsObject.themeId}`);
      logger.debug('Successfully deleted the theme in the database');
      return {
        ok: result.result.n > 0,
      };
    } catch (err) {
      logger.error('Error while deleting theme', err);
      throw err;
    }
  }

  async updateThemeImage({ themeId }, { type }, imageObject, { username }) {
    logger.debug('Executing query to update the theme image', themeId);
    try {
      const updatedTheme = (await themeDataService.updateThemeImage(themeId, type, imageObject.name, username)).value;
      const themesPath = `${constants.fs.paths.appRoot}/${constants.fs.directories.enframe.images.theme}`;
      // Delete the previously used theme image
      await filer.deleteFile(`${themesPath}/${themeId}/${updatedTheme.images[type]}`);
      // Move the uploaded image into the theme folder
      await filer.moveFile(
        imageObject.path,
        `${themesPath}/${themeId}/${imageObject.name}`,
      );
      logger.debug('Successfully updated the theme image');
    } catch (err) {
      logger.error('Error while updating theme image', err);
      throw err;
    }
  }
}

module.exports = new Theme();
