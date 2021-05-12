const DBManager = require('./dbManager');

class PGClient {
  constructor() {
    this.dbManager = new DBManager();
  }

  async executeQuery(query) {
    let client;
    try {
      client = await this.dbManager.acquire();
      const result = await client.query(query);
      this.dbManager.release(client);
      return result;
    } catch (err) {
      if (client) this.dbManager.destroy(client);
      throw err;
    }
  }
}

module.exports = new PGClient();
