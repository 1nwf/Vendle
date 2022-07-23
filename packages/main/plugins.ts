import { app } from "electron";
import { promises as fs } from "fs";

export const getPluginPaths = async () => {
  const pluginsPath = app.getPath("appData") + "/Vendle/extensions";
  let paths: string[] = [];
  let plugins = await fs.readdir(pluginsPath);
  plugins.forEach((dir) => {
    if (dir.startsWith(".")) return;
    paths.push(pluginsPath + "/" + dir);
    getPluginInfo(pluginsPath + "/" + dir);
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

const getPluginInfo = async (dir: string) => {
  let files = await fs.readdir(dir);
  if (!files.includes("package.json")) {
    console.log("plugin does not include a package.json file");
    return;
  }
  let info = JSON.parse(await fs.readFile(dir + "/package.json", "utf8"));
  return info;
};
