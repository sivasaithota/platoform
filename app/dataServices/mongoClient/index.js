const dbConfig = require('config').get('database.mongo');
const DBManager = require('./dbManager');

class MongoClient {
  constructor() {
    this.dbManager = new DBManager();
    this.dbName = dbConfig.dbname;
  }

  async _execute(callback) {
    let client;
    try {
      client = await this.dbManager.acquire();
      const result = await callback(client);
      this.dbManager.release(client);
      return result;
    } catch (err) {
      if (client) this.dbManager.destroy(client);
      throw err;
    }
  }

  dropDatabase(database) {
    return this._execute(client => client.db(database).dropDatabase());
  }

  addUser(database, username, password, role) {
    return this._execute(client => client.db(database).addUser(username, password, { roles: [{ db: this.dbName, role }] }));
  }

  removeUser(database, username) {
    return this._execute(client => client.db(database).removeUser(username));
  }

  createCollection(database, collection) {
    return this._execute(client => client.db(database).createCollection(collection));
  }

  insertOne(collection, document) {
    return this._execute(client => client.db(this.dbName).collection(collection).insertOne(document));
  }

  insertMany(collection, documents) {
    return this._execute(client => client.db(this.dbName).collection(collection).insertMany(documents));
  }

  save(collection, document) {
    return this._execute(client => client.db(this.dbName).collection(collection).save(document));
  }

  updateOne(collection, query, update, options = {}) {
    return this._execute(client => client.db(this.dbName).collection(collection).updateOne(query, update, options));
  }

  updateMany(collection, query, update, options = {}) {
    return this._execute(client => client.db(this.dbName).collection(collection).updateMany(query, update, options));
  }

  findOne(collection, filter, projection = {}) {
    return this._execute(client => client.db(this.dbName).collection(collection).findOne(filter, { projection }));
  }

  find(collection, filter, projection = {}, sort = {}, limit = 0, skip = 0) {
    return this._execute(client => client.db(this.dbName)
      .collection(collection)
      .find(filter, { projection })
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .toArray());
  }

  deleteOne(collection, query) {
    return this._execute(client => client.db(this.dbName).collection(collection).deleteOne(query));
  }

  deleteMany(collection, query) {
    return this._execute(client => client.db(this.dbName).collection(collection).deleteMany(query));
  }

  findOneAndReplace(collection, filter, document, projection) {
    return this._execute(client => client.db(this.dbName).collection(collection).findOneAndReplace(filter, document, { projection }));
  }

  findOneAndUpdate(collection, filter, update, projection) {
    return this._execute(client => client.db(this.dbName).collection(collection).findOneAndUpdate(filter, update, { projection }));
  }

  findOneAndDelete(collection, filter, projection) {
    return this._execute(client => client.db(this.dbName).collection(collection).findOneAndDelete(filter, { projection }));
  }

  countDocuments(collection, query, options = {}) {
    return this._execute(client => client.db(this.dbName).collection(collection).countDocuments(query, options));
  }

  distinct(collection, field, query, options = {}) {
    return this._execute(client => client.db(this.dbName).collection(collection).distinct(field, query, options));
  }

  aggregate(collection, pipeline) {
    return this._execute(client => client.db(this.dbName).collection(collection).aggregate(pipeline).toArray());
  }

  getObjectId(id) {
    return this.dbManager.getObjectId(id);
  }

  isValidObjectId(id) {
    return this.dbManager.isValidObjectId(id);
  }
}

module.exports = new MongoClient();
