const { username, password, dbname } = require('config').get('database.postgres');
const ApplicationManager = require('../../app/services/application/manager');
const { collection: { names: collectionNameConstants }, string: { postgresRoles } } = require('../../app/common/constants');

module.exports = {
  async up(db) {
    await db.collection(collectionNameConstants.setting).updateOne({},
      {
        $set: {
          edsadmin: {
            dbusername: username,
            dbpassword: password,
            dbname,
          },
        },
      });
    const apps = await db.collection(collectionNameConstants.application).find().toArray();
    await Promise.all(
      apps.map((app) => {
        const appManager = new ApplicationManager(app._id);
        const { roleName, dbusername, dbpassword } = appManager.getUserDataForRoles(postgresRoles.dba);
        return db.collection(collectionNameConstants.application).updateOne(
          { _id: app._id }, {
            $set: {
              'database.username': dbusername,
              'database.password': dbpassword,
              'database.roleName': roleName,
              'database.roles': {
                readWrite: appManager.getUserDataForRoles(postgresRoles.readWrite),
                readOnly: appManager.getUserDataForRoles(postgresRoles.readOnly),
                adhoc: appManager.getUserDataForRoles(postgresRoles.adhoc),
              },
            },
          },
        );
      }),
    );
  },

  async down(db) {
    await db.collection(collectionNameConstants.setting).updateOne({},
      {
        $unset: {
          edsadmin: { },
        },
      });

    const apps = await db.collection(collectionNameConstants.application).find({ 'database.roles': { $exists: true } }).toArray();
    await Promise.all(
      apps.map((app) => {
        return db.collection(collectionNameConstants.application).updateOne(
          { _id: app._id }, {
            $unset: {
              'database.roles': {},
            },
          },
        );
      }),
    );
  },
};
