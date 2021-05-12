const collectionNameConstants = require('../../app/common/constants').collection.names;

const acceptedDomains = [
  'opexanalytics.com',
  'llamasoft.com',
];

module.exports = {
  async up(db) {
    await db.collection(collectionNameConstants.setting).updateOne({},
      {
        $set: { acceptedDomains },
        $unset: { acceptedDomain: '' },
      });
  },

  async down(db) {
    await db.collection(collectionNameConstants.setting).updateOne({},
      {
        $unset: { acceptedDomains: '' },
      });
  },
};
