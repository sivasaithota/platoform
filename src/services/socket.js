import io from 'socket.io-client';
import { socket as socketConfig } from '../../configs/config.json';

export default class SocketHandler {
  start(roomId) {
    // connecting to socket
    this._socket = io({
      path: `/${socketConfig.hostname}${socketConfig.path}`,
      transports: ['websocket'],
      reconnection: socketConfig.reconnection,
      reconnectionDelay: socketConfig.reconnectionDelay,
      reconnectionDelayMax: socketConfig.reconnectionDelayMax,
      reconnectionAttempts: socketConfig.reconnectionAttempts,
    });
    this._socket.on('connect', () => {
      // connect success
      this._socket.emit('createRoom', roomId);
    });
  }

  // subscribe to event
  registerEvent(event, callback) {
    this._socket.on(event, callback);
  }

  // close socket connection
  close() {
    this._socket.close();
  }
}
