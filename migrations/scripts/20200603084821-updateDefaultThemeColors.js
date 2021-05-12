const { theme } = require('../../app/common/constants').collection.names;

module.exports = {
  async up(db) {
    const colorSchemes = [{ mainColor: '#263A4C', extraColor: '#00AB4E', complimentaryColor: '#FFC300' }]
    db.collection(theme).updateOne({name: "Default Theme"}, {$set: {colorSchemes} })
  },

  async down(db) {
    const colorSchemes = [{ mainColor: '#2D1389', extraColor: '#e53d6e', complimentaryColor: '#FFC300' }]
    db.collection(theme).updateOne({name: "Default Theme"}, {$set: {colorSchemes} })
  }
};
