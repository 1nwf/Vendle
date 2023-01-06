import { ipcRenderer } from "electron";
export const store = {
  async get(key: string) {
    const { invoke } = ipcRenderer;
    let value = await invoke("electron-store", "get", key);
    return value;
  },
  async set(key: string, value: any) {
    const { invoke } = ipcRenderer;
    await invoke("electron-store", "set", key, value);
  },
};
