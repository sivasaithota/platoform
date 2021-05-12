const { Client } = require('pg');
const genericPool = require('generic-pool');
const dbConfig = require('config').get('database.postgres');
const logger = require('../../common/logger');

class DBManager {
  constructor(dbOptions) {
    const pgOptions = dbOptions || {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.dbname,
    };
    const poolOptions = {
      min: dbConfig.minConnections,
      max: dbConfig.maxConnections,
      evictionRunIntervalMillis: dbConfig.evictionRunIntervalMillis,
      idleTimeoutMillis: dbConfig.idleTimeoutMillis,
      acquireTimeoutMillis: dbConfig.acquireTimeoutMillis,
      fifo: dbConfig.fifo,
      autostart: dbConfig.autoStart,
    };
    const factory = {
      async create() {
        try {
          const client = new Client(pgOptions);
          await client.connect();
          return client;
        } catch (err) {
          logger.fatal('Error while connecting to database', err);
          throw err;
        }
      },
      destroy(client) {
        client.end();
      },
    };
    this._pool = genericPool.createPool(factory, poolOptions);
  }

  acquire() {
    return this._pool.acquire();
  }

  release(client) {
    return this._pool.release(client);
  }

  destroy(client) {
    return this._pool.destroy(client);
  }
}

module.exports = DBManager;
