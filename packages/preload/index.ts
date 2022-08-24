import { ipcRenderer } from "electron";

// --------- Expose some API to the Renderer process. ---------
window.settings = ipcRenderer.sendSync("getSettings");
