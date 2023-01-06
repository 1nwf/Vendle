import { ipcMain } from "electron";
import Store from "electron-store";
import { defaultSettings } from "./settings";

export const store = new Store();
ipcMain.handle(
  "electron-store",
  async (_evnet, methodSign: string, ...args: any[]) => {
    if (typeof (store as any)[methodSign] === "function") {
      return (store as any)[methodSign](...args);
    }
    return (store as any)[methodSign];
  },
);
ipcMain.on("getSettings", (e) => {
  const settings = store.get("settings") as string;
  if (settings) {
    e.returnValue = JSON.parse(settings);
  } else {
    e.returnValue = defaultSettings;
  }
});
