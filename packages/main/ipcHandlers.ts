import {
  getPluginInfo,
  getPluginReadme,
  install,
  pluginUpdateAvailable,
  uninstallPlugin,
  updatePlugin,
} from "./plugins";
import {
  deleteNote,
  getFileContents,
  saveFile,
  saveFileSync,
  updateUserPfp,
} from "./util";

export const handleSaveFile = async (
  event: any,
  id: string,
  contents: string,
) => {
  return await saveFile(id, contents);
};

export const handleDeleteNote = async (event: any, id: string) => {
  return await deleteNote(id);
};

export const handleGetFileContents = async (event: any, name: string) => {
  return await getFileContents(name);
};

export const handleGetPluginInfo = async (event: any, dir: string) => {
  return await getPluginInfo(dir);
};

export const handleGetPluginReadme = async (event: any, name: string) => {
  return await getPluginReadme(name);
};

export const handleUninstallPlugin = async (event: any, name: string) => {
  return await uninstallPlugin(name);
};

export const handleInstallPlugin = async (event: any, name: string) => {
  return await install(name);
};

export const handleUpdatePlugin = async (event: any, name: string) => {
  return await updatePlugin(name);
};

export const handlePluginCheckUpdate = async (
  event: any,
  name: string,
  version: string,
) => {
  return await pluginUpdateAvailable(name, version);
};

export const handlePfpUpload = async (event: any, path: string) => {
  return await updateUserPfp(path);
};

export const handleAppQuit = (id: string, contents: string) => {
  if (id) {
    saveFileSync(id, contents);
  }
};
