'use strict';

const log4js = require('log4js');

class Command {

  constructor(name) {
    this._logger = log4js.getLogger(name);
  }

  exec() {
    throw new Error('Function not imlemented');
  }

  validate() {
    throw new Error('Function not imlemented');
  }

  static rules() {
    throw new Error('Function not imlemented');
  }
}

module.exports = Command;