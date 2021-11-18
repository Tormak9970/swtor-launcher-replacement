const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const child_process = require('child_process');

if (handleSquirrelEvent())  return;

const devBuild = true;
process.env.ELECTRON_ENABLE_LOGGING = devBuild;

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true,
});

app.on("ready", () => {
  app.setAppUserModelId('com.tormak.swtor-launcher-replacement');
  initMain();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) initMain();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function initMain() {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.on('ready-to-show', () => mainWindow.show());
  mainWindow.removeMenu();

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  initMainListeners(mainWindow);
}
/**
 * @param  {BrowserWindow} window window to apply the listeners to.
 */
function initMainListeners(window) {
  ipcMain.on('window', (event, data) => {
    if (data[0] === 'close') {
      app.quit();
    } else if (data[0] === 'minimize') {
      window.minimize();
    } else if (data[0] === 'maximize') {
      window.maximize();
    } else if (data[0] === 'restore') {
      window.restore();
    }
  });
}


//handles installation events
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = child_process.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};