const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  start: () => ipcRenderer.invoke('start', 'ping'),
  rules: (command) => request(ipcRenderer.invoke('rules', command)),
  macros: () => request(ipcRenderer.invoke('macros')),
  register: (shortcut) => request(ipcRenderer.invoke('register', shortcut)),
  switchTheme: (theme) => ipcRenderer.invoke('switchTheme', theme),
  onMacroInvokeEvent: (cb) => ipcRenderer.on('macroInvokeEvent', (_event, macro) => {
    console.log()
  });
});

async function request(promise) {
  let result = await promise;
  result = JSON.parse(result);
  if (result.isOK) {
    return result.data;
  }
  console.error(result.error);
  throw result.error;
}