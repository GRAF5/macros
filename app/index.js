const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const CommandService = require('./commands/commands.service');
const MacrosService = require('./macros/macros.service');
const log4js = require('log4js');

const createWindow = () => {
  const win = new BrowserWindow({
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'transparent',
      symbolColor: '#74b1be',
      height: 35
    },
    minWidth: 350,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('build/index.html');
  return win;
}

const commandService = new CommandService();
const macrosService = new MacrosService();

app.whenReady().then(() => {

  const win = createWindow();
  
  ipcMain.handle('start', async (event, commands) => {
    new CommandService().exec(JSON.stringify(
      [
        {type: 'move', random: true},
        {type: 'wait', ms: 100},
        {type: 'move', random: true},
      ]
    ))
  });

  configureLogs({});

  ipcMain.handle('switchTheme', (event, theme) => {
    let color = '#fafafa';
    let symbolColor = '#000000';
    switch (theme) {
      case 'light': {
        color = '#fafafa';
        symbolColor = '#000000';
        break;
      }
      case 'dark': {
        color = '#181818';
        symbolColor = '#9d9d9d';
        break;
      }
    }
    win.setTitleBarOverlay({color, symbolColor});
  });

  ipcMain.handle('rules', async (event, command) => {
    return await commandService.rule(command);
  });

  ipcMain.handle('macros', async (event) => {
    return await macrosService.load();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  });
});

function configureLogs(conf) {
  let logPath = path.join(__dirname, 'logs', 'application.log');
  let logDirPath = path.dirname(logPath);
  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath);
  }
  const appenders = {
    file: {
      type: 'dateFile',
      filename: logPath,
      pattern: 'yyyy-MM-dd',
      numBackups: (conf.log4js || {}).backups || 1,
      keepFileExt: true,
      timezoneOffset: 0
    }
  };
  const defaultAppenders = ['file'];
  // if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
  appenders.console = {type: 'console'};
  defaultAppenders.push('console');
  // }
  const categories = {
    default: {
      appenders: defaultAppenders,
      level: log4js.levels[(conf.log4js || {}).defaultLevel || 'INFO']
    }
  };
  const configLevels = ((conf.log4js || {}).levels || {});
  Object.keys(configLevels).forEach((category) => {
    categories[category] = {
      appenders: defaultAppenders,
      level: log4js.levels[configLevels[category]]
    };
  });
  log4js.configure({
    appenders: appenders,
    categories: categories
  });
}