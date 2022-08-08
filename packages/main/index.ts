import { app, BrowserWindow, shell, ipcMain, protocol } from "electron";
import { release } from "os";
import { join } from "path";

import {
  handleDeleteNote,
  handleGetFileContents,
  handleGetPluginInfo,
  handleSaveFile,
} from "./ipcHandlers";
import "./store";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
import * as plugins from "./plugins";
import { initDirs } from "./util";

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    webPreferences: {
      // preload: join(__dirname, "../preload/index.cjs"),
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: "hiddenInset",
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;

    win.loadURL(url);
    win.webContents.openDevTools();
  }

  // Test active push message to Renderer-process
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  ipcMain.handle("get-plugins-path", async () => {
    return await plugins.getPluginPaths();
  });
  ipcMain.handle("initDirs", () => {
    initDirs();
  });

  ipcMain.handle("saveFile", handleSaveFile);
  ipcMain.handle("deleteNote", handleDeleteNote);
  ipcMain.handle("getFileContents", handleGetFileContents);
  ipcMain.handle("getPluginInfo", handleGetPluginInfo);
  protocol.registerFileProtocol("atom", (request, callback) => {
    const url = request.url.substr(7);
    callback({ path: url });
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
