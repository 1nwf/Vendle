import { app, BrowserWindow, ipcMain, protocol, shell } from "electron";
import { release } from "os";
import { join } from "path";

import {
  handleAppQuit,
  handleDeleteNote,
  handleGetFileContents,
  handleGetPluginInfo,
  handleGetPluginReadme,
  handleInstallPlugin,
  handlePfpUpload,
  handlePluginCheckUpdate,
  handleSaveFile,
  handleUninstallPlugin,
  handleUpdatePlugin,
} from "./ipcHandlers";
import "./store";

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
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
import { store } from "./store";
import { defaultSettings } from "./settings";

let win: BrowserWindow | null = null;
let windowConfig = {
  width: 1280,
  height: 680,
};

async function createWindow() {
  let storedWindowConfig = store.get("winBounds") as string;
  if (storedWindowConfig) {
    Object.assign(windowConfig, storedWindowConfig);
  }
  win = new BrowserWindow({
    title: "Main window",
    webPreferences: {
      preload: join(__dirname, "../preload/index.cjs"),
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
    titleBarStyle: "hiddenInset",
    ...windowConfig,
  });

  let settings = store.get("settings") as typeof defaultSettings | undefined;

  if (settings) {
    let bg: string;
    if (settings.isLightTheme) {
      bg = settings.lightTheme.appBg;
    } else {
      bg = settings.darkTheme.appBg;
    }
    const opacity = bg.substring(17, bg.indexOf(";")).trim();
    bg = bg.slice(37, bg.indexOf(", var")) + ", " + opacity + ")";
    win.setBackgroundColor(bg);
  }

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${
      process.env["VITE_DEV_SERVER_PORT"]
    }`;

    win.loadURL(url);
    win.webContents.openDevTools();
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  ipcMain.handle("getPluginsPath", async () => {
    return await plugins.getPluginPaths();
  });
  ipcMain.handle("initDirs", () => {
    initDirs();
  });

  win.on("ready-to-show", () => {
    win!.show();
  });

  win.on("enter-full-screen", () => {
    win?.webContents.send("fullscreen");
  });
  win.on("leave-full-screen", () => {
    win?.webContents.send("leave-fullscreen");
  });

  ipcMain.handle("saveFile", handleSaveFile);
  ipcMain.handle("deleteNote", handleDeleteNote);
  ipcMain.handle("getFileContents", handleGetFileContents);
  ipcMain.handle("getPluginInfo", handleGetPluginInfo);
  ipcMain.handle("getPluginReadme", handleGetPluginReadme);
  ipcMain.handle("uninstallPlugin", handleUninstallPlugin);
  ipcMain.handle("installPlugin", handleInstallPlugin);
  ipcMain.handle("updatePlugin", handleUpdatePlugin);
  ipcMain.handle("pluginCheckUpdate", handlePluginCheckUpdate);
  ipcMain.handle("pfpUpload", handlePfpUpload);
  ipcMain.on("app_quit", (event: any, id: string, contents: string) => {
    if (win) {
      Object.assign(windowConfig, {
        isMaximized: win.isMaximized(),
      }, win.getNormalBounds());
      store.set("winBounds", windowConfig);
    }
    handleAppQuit(id, contents);
  });
  ipcMain.on("reload", () => {
    win?.webContents.reloadIgnoringCache();
  });
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
