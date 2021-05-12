const collectionNameConstants = require('../../app/common/constants').collection.names;

module.exports = {
  async up(db) {
    db.collection(collectionNameConstants.template)
      .updateOne(
        { name: 'reportType' },
        { $push: { collection: { typeName: 'shiny', displayName: 'Shiny R Report' } } },
      );
  },

  async down(db) {
    db.collection(collectionNameConstants.template)
      .updateOne(
        { name: 'reportType' },
        { $pull: { collection: { typeName: 'shiny' } } },
      );
  },
};
