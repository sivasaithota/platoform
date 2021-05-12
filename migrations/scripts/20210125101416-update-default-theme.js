const { theme } = require('../../app/common/constants').collection.names;

module.exports = {
  async up(db, client) {
    const colorSchemes = [{ mainColor: '#268ECD', extraColor: '#53B8E7', complimentaryColor: '#FFC300' }];
    db.collection(theme).updateOne({ name: 'Default Theme' }, { $set: { colorSchemes } });
  },

  async down(db, client) {
    const colorSchemes = [{ mainColor: '#263A4C', extraColor: '#00AB4E', complimentaryColor: '#FFC300' }];
    db.collection(theme).updateOne({ name: 'Default Theme' }, { $set: { colorSchemes } });
  },
};
