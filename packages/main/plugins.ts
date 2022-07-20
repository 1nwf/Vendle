import { app } from "electron";
import { readdirSync } from "fs";

export const getPluginPaths = () => {
  const pluginsPath = app.getPath("appData") + "/Vendle/extensions";
  let paths: string[] = [];
  readdirSync(pluginsPath).forEach((file) => {
    if (file.endsWith(".js")) {
      paths.push(pluginsPath + "/" + file);
    }
  });
  return paths;
};

export const loadPlugins = (pluginsPaths: string[]) => {
  let modules: any[] = [];
  pluginsPaths.forEach((path) => {
    modules.push(require(path));
  });
  return modules;
};
