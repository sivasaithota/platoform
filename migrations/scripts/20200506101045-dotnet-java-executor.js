const collectionNameConstants = require('../../app/common/constants').collection.names;

const collections = [
  {
    typeName: 'dotnetcore',
    displayName: 'dotnetcore',
    versions: [{ value: '3.1', displayValue: 'v3.1', command: 'sh /run.sh' }],
  },
  {
    typeName: 'java',
    displayName: 'java',
    versions: [
      { value: '8', displayValue: 'v8', command: 'java' },
      { value: '14', displayValue: 'v14', command: 'java' },
    ],
  },
];

module.exports = {
  async up(db, client) {
    await db.collection(collectionNameConstants.template).updateOne(
      { name: 'command' },
      {
        $push: {
          collection: {
            $each: collections,
          },
        },
      },
    );
  },

  async down(db, client) {
    await db.collection(collectionNameConstants.template).updateOne(
      { name: 'command' },
      {
        $pull: {
          collection: {
            typeName: {
              $in: ['java', 'dotnetcore'],
            },
          },
        },
      },
    );
  },
};
