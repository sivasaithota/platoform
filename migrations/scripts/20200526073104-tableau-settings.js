const collectionNameConstants = require('../../app/common/constants').collection.names;

module.exports = {
  async up(db) {
    await db.collection(collectionNameConstants.setting).updateOne(
      { tableau: { $exists: true } }, {
        $set: {
          'tableau.siteContentUrl': '',
          'tableau.databaseServer': '',
        },
      },
    );
  },

  async down() {
  },
};
