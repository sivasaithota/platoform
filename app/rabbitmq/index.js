const amqp = require('amqplib/callback_api');

class RabbitMQ {
  constructor(config) {
    this._config = config;
    this._connectionString = `amqp://${this._config.username}:${this._config.password}@${this._config.host}:${this._config.port}`;
  }

  _createConnection() {
    return new Promise((resolve, reject) => {
      amqp.connect(this._connectionString, (err, connection) => (err ? reject(err) : resolve(connection)));
    });
  }

  _createChannel() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this._connection.createConfirmChannel((err, channel) => (err ? reject(err) : resolve(channel)));
    });
  }

  async _closeConnection() {
    if (this._channel) await this._channel.close();
    await this._connection.close();
  }

  publish(message) {
    const _this = this;
    return new Promise(async (resolve, reject) => {
      _this._connection = await _this._createConnection();
      _this._channel = await _this._createChannel();
      _this._channel.publish('', _this._config.queueName, Buffer.from(message), {
        persistent: true,
        durable: true,
        contentEncoding: 'utf-8',
        contentType: 'text/plain',
      }, (err) => {
        _this._closeConnection();
        return err ? reject(err) : resolve();
      });
    });
  }
}

module.exports = RabbitMQ;
