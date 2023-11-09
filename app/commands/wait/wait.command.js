'use strict';

const Command = require('../command');
const _ = require('lodash');

/**
 * @typedef WaitParams
 * @property {Number} [ms] wait time in milliseconds. Default 500
 */

class WaitCommand extends Command {

  /**
   * Wait command class constructor
   * @param {WaitParams} params 
   */
  constructor(params) {
    super(WaitCommand.name);
    this._params = params;
  }

  exec() {
    return this._exec.bind(this);
  }

  async _exec(next) {
    try {
      const ms = _.defaultTo(this._params.ms, 500);
      // console.log('start ' + Date.now())
      await new Promise(res => {
        setTimeout(res, ms);
      });
      // console.log('end ' + Date.now())
      await next();
    } catch (error) {
      this._logger.error('Failed to wait', error);
      next(error);
    }
  }
};

module.exports = WaitCommand;