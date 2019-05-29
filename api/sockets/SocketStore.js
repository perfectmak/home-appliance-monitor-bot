'use strict';

/**
 * Manages the Sockets
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const _cache = {

};

const Cache = {

  /**
   * NOTE: Sockets that are added have an additional once method attached to it.
   *
   * @param id
   * @param socket
   */
  add(id, socket) {
    _cache[id] = socket;

    socket.once = (event, callback) => {
      const _callback = (msg) => {
        callback(msg)
        socket.removeListener(event, _callback);
      };
      socket.on(event, _callback);
    };

    socket.on('disconnect', () => {
      delete _cache[id];
    });
  },

  get(id) {
    if(_cache.hasOwnProperty(id)) {
      return _cache[id];
    } else {
      return null;
    }
  }
};

module.exports = Cache;
