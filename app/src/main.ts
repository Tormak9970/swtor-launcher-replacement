import { app, BrowserWindow, dialog, ipcMain, screen } from "electron";
import * as path from "path";
import {spawn as childSpawn} from'child_process';

// if (handleSquirrelEvent()) {
//   return;
// }

const devBuild = true;
// process.env.ELECTRON_ENABLE_LOGGING = devBuild;

app.on("ready", () => {
  app.setAppUserModelId('com.tormak.swtor-launcher-replacement');
  initMain();
  initGlobalListeners();
  
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
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "./components/index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

function initMainListeners(window: BrowserWindow) {

}

function initGlobalListeners() {

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

  const spawn = function(command:string, args:any) {
    let spawnedProcess, error;

    try {
      spawnedProcess = childSpawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args:any) {
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