const mongoClient = require('../mongoClient');
const constants = require('../../common/constants');

class Theme {
  getDefaultThemeId() {
    return mongoClient.findOne(
      constants.collection.names.theme,
      { name: 'Default Theme' },
      { _id: 1 },
    );
  }

  async recreatePresetThemes(themes) {
    themes.forEach(theme => theme.colorSchemes.forEach(scheme => Object.assign(scheme, { _id: mongoClient.getObjectId() })));
    mongoClient.deleteMany(constants.collection.names.theme, { group: { $ne: 'custom' } });
    return mongoClient.insertMany(constants.collection.names.theme, themes);
  }

  getTheme(themeId, group) {
    const projection = {
      name: 1,
      group: 1,
      images: 1,
      colorSchemes: 1,
      disableFooter: 1,
    };

    return mongoClient.findOne(
      constants.collection.names.theme,
      { _id: mongoClient.getObjectId(themeId), ...({ group } || {}) },
      projection,
    );
  }

  getThemes() {
    return mongoClient.find(constants.collection.names.theme);
  }

  createTheme(theme) {
    return mongoClient.insertOne(
      constants.collection.names.theme,
      {
        group: constants.defaultProperties.customTheme.group,
        ...theme,
      },
    );
  }

  updateTheme(themeId, themeData) {
    return mongoClient.updateOne(
      constants.collection.names.theme,
      { _id: mongoClient.getObjectId(themeId) },
      { $set: themeData },
    );
  }

  deleteTheme(themeId) {
    return mongoClient.deleteOne(
      constants.collection.names.theme,
      { _id: mongoClient.getObjectId(themeId) },
    );
  }

  updateThemeImage(themeId, type, filename, username) {
    const update = {
      [`images.${type}`]: filename,
      updatedBy: username,
      updatedAt: new Date(),
    };

    return mongoClient.findOneAndUpdate(
      constants.collection.names.theme,
      { _id: mongoClient.getObjectId(themeId) },
      { $set: update },
      { [`images.${type}`]: 1 },
    );
  }
}

module.exports = new Theme();
