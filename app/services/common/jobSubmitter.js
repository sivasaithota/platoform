const rabbitMQConfig = require('config').get('rabbitmq');
const RabbitMQ = require('../../rabbitmq');

class JobSubmitter {
  constructor(customConfig) {
    this.config = { ...rabbitMQConfig, ...customConfig };
  }

  submitJob(jobObject) {
    return new RabbitMQ(this.config).publish(JSON.stringify(jobObject));
  }
}

module.exports = JobSubmitter;
