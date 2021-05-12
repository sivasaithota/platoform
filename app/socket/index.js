const io = require('socket.io-client');

const socketConfig = require('config').get('socket');
const logger = require('../common/logger');

class SocketHandler {
  constructor() {
    this._socket = io(`http://${socketConfig.hostname}:${socketConfig.port}`, {
      path: socketConfig.path,
      transports: ['websocket'],
      reconnection: socketConfig.reconnection,
      reconnectionDelay: socketConfig.reconnectionDelay,
      reconnectionDelayMax: socketConfig.reconnectionDelayMax,
      reconnectionAttempts: socketConfig.reconnectionAttempts,
    });
    this._socket.on('connect', () => logger.info('Socket connection established successfully.'));
  }

  joinRoom(roomId) {
    this._socket.emit('createRoom', roomId);
  }

  leaveRoom(roomId) {
    this._socket.emit('leaveRoom', roomId);
  }

  registerEvent(event, callback) {
    this._socket.on(event, callback);
  }

  close() {
    logger.info('Closing socket connection.');
    this._socket.close();
  }

  broadcastEvent(event, message) {
    this._socket.emit('broadcast', {
      event,
      message,
    });
  }

  emitEvent(roomId, event, message) {
    this._socket.emit('emit', roomId, {
      event,
      message,
    });
  }
}

module.exports = new SocketHandler();
