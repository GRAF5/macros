'use strict';

const log4js = require('log4js');

class Service {

  constructor(name) {
    this._logger = log4js.getLogger(name);
  };

  _middlewares(cbs) {
    return async (condition) => {
      const commands = [...cbs];
      const next = async (err) => {
        if (err) {
          throw err;
        }
        const cb = commands.shift();
        if (cb && condition()) {
          await cb(next);
        }
      }
      await next();
    }
  }

  _send(status, data, error) {
    return JSON.stringify({
      isOK: error ? false : true,
      status,
      data,
      error
    });
  }
}

module.exports = Service;