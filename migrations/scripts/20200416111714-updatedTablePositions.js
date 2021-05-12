const collectionNameConstants = require('../../app/common/constants').collection.names;

module.exports = {
  async up(db) {
    const tables = await db.collection(collectionNameConstants.table)
      .aggregate([
        {
          $sort: {
            'tag.name': 1,
          },
        }, {
          $group: {
            _id: {
              appId: '$appId',
              type: '$type',
            },
            items: { $push: '$$ROOT' },
          },
        }, {
          $unwind: {
            path: '$items',
            includeArrayIndex: 'items.typePosition',
          },
        }, {
          $replaceRoot: {
            newRoot: '$items',
          },
        },
      ]).toArray();

    if (!tables.length) return;
    await db.collection(collectionNameConstants.table).rename('disorderedTables');
    await db.collection(collectionNameConstants.table).insertMany(tables);
    await db.collection('disorderedTables').drop();
  },

  // eslint-disable-next-line no-empty-function
  async down() {},
};
