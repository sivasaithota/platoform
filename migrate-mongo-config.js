const mongoConfig = require('config').get('database.mongo');

module.exports = {
  mongodb: {
    url: `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}`,
    databaseName: mongoConfig.dbname,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: './migrations/scripts',
  changelogCollectionName: 'changelog',
};
