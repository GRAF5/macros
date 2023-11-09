'use strict';

const Service = require('../classes/service');
const { compose } = require('../errors/handler');
const os = require('os');
const fs = require('fs');
const path = require('path');
const Schema = require('validate');
const { globalShortcut } = require('electron');
const CommandService = require('../commands/commands.service');
const uuid = require('uuid');

class MacrosService extends Service {

  constructor() {
    super(MacrosService.name);
    this._commandService = new CommandService();
    this._macroSchema = new Schema({
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: false
      },
      shortcut: {
        type: String,
        required: false
      },
      repeat: {
        type: Boolean,
        required: false
      },
      commands: [
        {
          properties: {
            type: {
              type: String,
              required: true
            }
          }
        }
    ]}, {strip: false});
  }

  async load() {
    try {
      const macros = [];
      const appDir = path.join(os.homedir(), 'macros');
      if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir);
      }
      fs.readdirSync(appDir).forEach(filename => {
        try {
          const file = path.parse(filename);
          const filepath = path.resolve(appDir, filename);
          const stat = fs.statSync(filepath);
          if (stat.isFile() && file.ext === '.json') {
            const macro = JSON.parse(fs.readFileSync(filepath));
            const errors = this._macroSchema.validate(macro)
            if (errors.length) {
              throw errors;
            }
            macro.id = this._getId();
            macros.push(macro);
            this._register(macro);
          }
        } catch (err) {
          this._logger.error(`Fail to load macro ${filename}`, err);
        }
      });
      return this._send(200, {macros});
    } catch (error) {
      this._logger.error('Fail to load macros', error);
      return compose(error);
    }
  }

  async _register({shortcut, commands, id, repeat = false}) {
    globalShortcut.register(shortcut, async () => {
      await this._commandService.exec(commands, id, repeat);
    })
  }

  async _uregister(shortcut) {
    globalShortcut.unregister(shortcut);
  }

  _getId() {
    return uuid.v4();
  }

  async _validate(macro) {

  }
}

module.exports = MacrosService;