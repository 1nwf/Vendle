import { app } from "electron";
import { resolve } from "path";

export const NOTES_PATH = app.getPath("appData") + "/Vendle/notes/";
export const PLUGINS_PATH = app.getPath("appData") + "/Vendle/extensions/";
export const SETTINGS_PATH = app.getPath("appData") + "/Vendle/user.json";
export const WORKSPACE_FILES =
  app.getPath("appData") + "/Vendle/workspace_files.json";

export const yarn = resolve(__dirname, "../yarn-standalone.js");
