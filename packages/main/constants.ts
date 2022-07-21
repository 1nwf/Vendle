import { app } from "electron";

export const NOTES_PATH = app.getPath("appData") + "/Vendle/extensions/";
export const PLUGINS_PATH = app.getPath("appData") + "/Vendle/notes/";
export const SETTINGS_PATH = app.getPath("appData") + "Vendle/settings.json";
export const WORKSPACE_FILES =
  app.getPath("appData") + "Vendle/workspace_files.json";
