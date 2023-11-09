'use strict';

const Service = require('../classes/service');
const { compose } = require('../errors/handler');
const MoveCommand = require('./move/move.command');
const WaitCommand = require('./wait/wait.command');

class CommandService extends Service {

  constructor() {
    super(CommandService.name);    
    this._executable = {};
  }

  async validate(commands) {

  }

  async exec(commands, id, repeat = false) {
    try {
      if (!this._executable[id]) {
        const commandsCbs = [];
        for (let cm of commands) {
          switch (cm.type) {
            case 'move': {
              commandsCbs.push(new MoveCommand(cm).exec());
              break;
            }
            case 'wait': {
              commandsCbs.push(new WaitCommand(cm).exec());
              break;
            }
          }
        }
        const chain = this._middlewares(commandsCbs);
        this._executable[id] = true;
        while (this._executable[id]) {
          await chain(() =>this._executable[id]);
          if (!repeat) {
            delete this._executable[id];
            break;
          }
        }
      } else {
        delete this._executable[id];
      }
    } catch (error) {
      this._logger.error('Fail to execute commands', error);
      return compose(error);
    }
  }

  async rule(command) {
    try {
      let rules;
      switch (command) {
        case 'move': {
          rules = MoveCommand.rules();
          break;
        }
        case 'wait': {
          rules = WaitCommand.rules();
          break;
        }
      }
      return this._send(200, rules);
    } catch (error) {
      this._logger.error('Fail to get command rules', error);
      return this._send(500, rules);
    }
  }
}

module.exports = CommandService;