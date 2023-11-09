'use strict';

const { mouse, Point, screen } = require('@nut-tree/nut-js');
const Command = require('../command.js');
const _ = require('lodash');

/**
 * @typedef MoveParams
 * @property {Number} [x] x axis. Default 0
 * @property {Number} [y] y axis. Default 0
 * @property {Number} [min_x] minimum x value for random generation. Default 0
 * @property {Number} [min_y] minimum y value for random generation. Default 0
 * @property {Number} [max_x] maximum x value for random generation. Default screen width
 * @property {Number} [max_y] maximum y value for random generation. Default screen height
 * @property {Boolean} [random] get x and y axis randomly. Default false
 */

class MoveCommand extends Command {

  /**
   * Move command class constructor
   * @param {MoveParams} params 
   */
  constructor(params) {
    super(MoveCommand.name);  
    this._params = params;
  }

  exec() {
    return this._exec.bind(this);
  }

  static rules() {
    return {
      rules: {
        x: {
          type: 'number',
          description: 'move.command.x',
          obligatory: false,
          conditions: [],
          validate: (value) => value > 0
        },
        y: {
          type: 'number',
          description: 'move.command.y',
          obligatory: false,
          conditions: [],
          validate: (value) => value > 0
        },
        min_x: {
          type: 'number',
          description: 'move.command.min_x',
          obligatory: false,
          conditions: ['random'],
          validate: (value) => value > 0
        },
        min_y: {
          type: 'number',
          description: 'move.command.min_y',
          obligatory: false,
          conditions: ['random'],
          validate: (value) => value > 0
        },
        max_x: {
          type: 'number',
          description: 'move.command.max_x',
          obligatory: false,
          conditions: ['random'],
          validate: (value) => value > 0
        },
        max_y: {
          type: 'number',
          description: 'move.command.max_y',
          obligatory: false,
          conditions: ['random'],
          validate: (value) => value > 0
        },
        random: {
          type: 'boolean',
          description: 'move.command.random',
          obligatory: false,
          conditions: []
        }
      }
    }
  }

  async _exec(next) {
    try {
      this._params.max_x = _.defaultTo(this._params.max_x, await screen.width());
      this._params.max_y = _.defaultTo(this._params.max_y, await screen.height());
      const x = this._getAxis('x');
      const y = this._getAxis('y');
      await mouse.setPosition(new Point(x, y));
      await next();
    } catch (error) {
      this._logger.error('Failed to move cursor', error);
      next(error);
    }
  }

  _getAxis(axis) {
    if (this._params[axis]) {
      return this._params[axis];
    }
    if (this._params.random) {
      return Math.floor(Math.random() * this._params[`max_${axis}`]) + _.defaultTo(this._params[`min_${axis}`], 0);
    }
    return 0;
  }
}

module.exports = MoveCommand;