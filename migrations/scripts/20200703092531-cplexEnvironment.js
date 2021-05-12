const collectionNameConstants = require('../../app/common/constants').collection.names;

module.exports = {
  async up(db) {
    await db.collection(collectionNameConstants.environment)
      .insertOne({
        name: 'cplex-executor:12.10',
        command: 'python3.7 -uO',
        options: '',
        type: 'default',
        registry: 'opexanalytics/',
        description: 'CPLEX executor build on top of python3.7',
      });
  },

  async down(db) {
    await db.collection(collectionNameConstants.environment)
      .deleteOne({ name: 'cplex-executor:12.10' });
  },
};
