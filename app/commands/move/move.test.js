'use strict';

const { mouse, Point } = require('@nut-tree/nut-js');
const MoveCommand = require('./move.command');
const should = require('should');
const sinon = require('sinon');

describe(MoveCommand.name, () => {

  let sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('_getAxis', () => {

    it('should return 0 by defauld', () => {
      let command = new MoveCommand({});
      should(command._getAxis('x')).be.eql(0);
    });

    it('should return declared axis value', () => {
      let command = new MoveCommand({x: 10});
      should(command._getAxis('x')).be.eql(10);
    });

    it('should return random value', () => {
      let command = new MoveCommand({random: true, max_x: 10});
      sandbox.stub(Math, 'random').returns(1)
      should(command._getAxis('x')).be.eql(10);
    });
  });

  describe('exec', () => {

    it('should set mouse position', async () => {
      let command = new MoveCommand({x: 1, y: 1, workAreaSize: {width: 10, height: 10}});
      let spy = sandbox.spy(mouse, 'setPosition');
      await command.exec();
      should(spy.calledOnceWith(new Point(1, 1)));
    });
  });
});