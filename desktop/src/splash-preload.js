'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('splashAPI', {
  onStatus: (cb) => ipcRenderer.on('status', (_e, data) => cb(data)),
});
