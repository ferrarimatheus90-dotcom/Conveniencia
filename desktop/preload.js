'use strict';

const { contextBridge, ipcRenderer } = require('electron');

// API mínima disponível para o sistema (window.desktopAPI).
// O app web continua funcionando normalmente sem ela (versão navegador).
contextBridge.exposeInMainWorld('desktopAPI', {
  isDesktop: true,
  getInfo: () => ipcRenderer.invoke('app:info'),
  checkUpdates: () => ipcRenderer.invoke('app:checkUpdates'),
});
