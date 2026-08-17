'use strict';

const { app, BrowserWindow, Menu, dialog, shell, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');

const { startServer } = require('./src/server');
const { Updater } = require('./src/updater');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

const isPacked = app.isPackaged;
// Em produção: cópia gravável em %APPDATA%. Em desenvolvimento: o próprio repositório.
const bundledDir = isPacked ? path.join(process.resourcesPath, 'webapp') : path.join(__dirname, '..');
const webappDir = isPacked ? path.join(app.getPath('userData'), 'webapp') : bundledDir;
const stateFile = path.join(app.getPath('userData'), 'update-state.json');

let mainWindow = null;
let splashWindow = null;
let serverUrl = null;
let updateTimer = null;
let checking = false;

const updater = new Updater({ config, webappDir, bundledDir, stateFile });

/* ------------------------------------------------------------------ splash */

function createSplash() {
  splashWindow = new BrowserWindow({
    width: 460,
    height: 300,
    frame: false,
    resizable: false,
    center: true,
    show: true,
    backgroundColor: '#12151c',
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  return splashWindow;
}

function splashStatus(msg, pct) {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.send('status', { msg, pct });
  }
}

/* ------------------------------------------------------------ janela app */

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    show: false,
    backgroundColor: '#12151c',
    title: 'Conveniência Oliveira',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });

  mainWindow.setMenu(buildMenu());

  // O sistema abre janelas novas para imprimir cupom/comanda (window.open).
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url && url !== 'about:blank' && !url.startsWith(serverUrl)) {
      shell.openExternal(url); // links externos vão para o navegador padrão
      return { action: 'deny' };
    }
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        width: 420,
        height: 700,
        autoHideMenuBar: true,
        backgroundColor: '#ffffff',
        webPreferences: { contextIsolation: true, nodeIntegration: false },
      },
    };
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (splashWindow && !splashWindow.isDestroyed()) splashWindow.close();
    splashWindow = null;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL(serverUrl);
}

function buildMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'Sistema',
      submenu: [
        {
          label: 'Verificar atualizações',
          accelerator: 'CmdOrCtrl+U',
          click: () => checkForUpdates({ manual: true }),
        },
        { label: 'Recarregar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Imprimir', accelerator: 'CmdOrCtrl+P', click: () => mainWindow?.webContents.print() },
        { type: 'separator' },
        { label: 'Sobre', click: showAbout },
        { type: 'separator' },
        { label: 'Sair', accelerator: 'Alt+F4', role: 'quit' },
      ],
    },
    {
      label: 'Exibir',
      submenu: [
        { label: 'Aumentar zoom', role: 'zoomIn' },
        { label: 'Diminuir zoom', role: 'zoomOut' },
        { label: 'Zoom normal', role: 'resetZoom' },
        { label: 'Tela cheia', role: 'togglefullscreen' },
        { type: 'separator' },
        { label: 'Ferramentas do desenvolvedor', accelerator: 'F12', role: 'toggleDevTools' },
      ],
    },
  ]);
}

function showAbout() {
  const s = updater.state;
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Conveniência Oliveira',
    message: `Conveniência Oliveira – Sistema de Gestão`,
    detail:
      `Versão do aplicativo: ${app.getVersion()}\n` +
      `Repositório: ${config.github.owner}/${config.github.repo} (${config.github.branch})\n` +
      `Última atualização: ${s.updatedAt ? new Date(s.updatedAt).toLocaleString('pt-BR') : 'nunca'}\n` +
      `Revisão: ${s.sha ? s.sha.slice(0, 7) : '—'}\n` +
      `Dados locais: ${app.getPath('userData')}`,
    buttons: ['OK'],
  });
}

/* -------------------------------------------------------------- updates */

async function checkForUpdates({ manual = false } = {}) {
  if (checking) return;
  checking = true;
  try {
    const result = await updater.check((msg, pct) => splashStatus(msg, pct));

    if (result.updated) {
      if (!mainWindow) return; // atualizou antes de abrir: já carrega a versão nova
      const { response } = await dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Atualização disponível',
        message: 'Uma nova versão do sistema foi baixada.',
        detail: `${result.changed} arquivo(s) atualizado(s). Recarregar agora para aplicar?`,
        buttons: ['Recarregar agora', 'Depois'],
        defaultId: 0,
        cancelId: 1,
      });
      if (response === 0) mainWindow.reload();
      return;
    }

    if (manual && mainWindow) {
      dialog.showMessageBox(mainWindow, {
        type: result.offline ? 'warning' : 'info',
        title: 'Atualizações',
        message: result.offline
          ? 'Não foi possível verificar as atualizações.'
          : 'O sistema já está na versão mais recente.',
        detail: result.offline
          ? `Sem conexão com o GitHub. O sistema continua funcionando com a versão instalada.\n\nDetalhe: ${result.error}`
          : `Revisão ${result.sha ? result.sha.slice(0, 7) : '—'}`,
        buttons: ['OK'],
      });
    }
  } finally {
    checking = false;
  }
}

/* ---------------------------------------------------------------- boot */

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    createSplash();

    try {
      splashStatus('Preparando arquivos...', null);
      await updater.loadState();
      if (isPacked) await updater.ensureWebapp();

      if (config.update.checkOnStartup) {
        await checkForUpdates();
      }

      splashStatus('Iniciando servidor local...', null);
      const started = await startServer({
        root: webappDir,
        host: config.server.host,
        port: config.server.port,
      });
      serverUrl = started.url;

      // Permite impressão e acesso ao Supabase; bloqueia permissões que o app não usa.
      session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
        callback(['clipboard-read', 'clipboard-sanitized-write', 'notifications'].includes(permission));
      });

      splashStatus('Abrindo sistema...', null);
      createMainWindow();

      const minutes = config.update.intervalMinutes || 0;
      if (minutes > 0) {
        updateTimer = setInterval(() => checkForUpdates(), minutes * 60 * 1000);
      }
    } catch (err) {
      if (splashWindow && !splashWindow.isDestroyed()) splashWindow.close();
      dialog.showErrorBox(
        'Erro ao iniciar',
        `Não foi possível iniciar o sistema.\n\n${err.message}\n\n` +
          `Se o erro citar a porta ${config.server.port}, feche outras cópias do aplicativo e tente novamente.`
      );
      app.quit();
    }
  });

  app.on('window-all-closed', () => {
    if (updateTimer) clearInterval(updateTimer);
    app.quit();
  });
}

ipcMain.handle('app:info', () => ({
  version: app.getVersion(),
  sha: updater.state.sha,
  updatedAt: updater.state.updatedAt,
  repo: `${config.github.owner}/${config.github.repo}`,
}));

ipcMain.handle('app:checkUpdates', () => checkForUpdates({ manual: true }));
