const collectionNameConstants = require('../../app/common/constants').collection.names;

module.exports = {
  async up(db, client) {
    await db.collection(collectionNameConstants.environment)
      .updateOne(
        { 'internalName': 'ticdat' },
        {
          $set: { command: 'python3.8 -m self_serve_ticdat' },
        });
  },

  async down(db, client) {
    await db.collection(collectionNameConstants.environment)
      .updateOne(
        { 'internalName': 'ticdat' },
        {
          $set: { command: 'python3.8 -uO' },
        });
  }
};
