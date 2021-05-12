const collectionNameConstants = require('../../app/common/constants').collection.names;

module.exports = {
  async up(db) {
    const settings = await db.collection(collectionNameConstants.setting).findOne({});
    if (!settings.acceptedDomains.includes('coupa.com')) {
      await db.collection(collectionNameConstants.setting).updateOne({},
        {
          $push: { acceptedDomains: 'coupa.com' },
        });
    }
  },

  async down(db, client) {
  }
};
