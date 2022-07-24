import { app } from "electron";
import { promises as fs } from "fs";
import { Module, Plugin, pluginApis } from "../types/plugins";

export const getPluginPaths = async () => {
  const pluginsPath = app.getPath("appData") + "/Vendle/extensions";
  let paths: string[] = [];
  let plugins = await fs.readdir(pluginsPath);
  plugins.forEach((dir) => {
    if (dir.startsWith(".")) return;
    paths.push(pluginsPath + "/" + dir);
  });
  return paths;
};

export const getPluginInfo = async (
  dir: string
): Promise<Omit<Plugin, "path" | "module">> => {
  let files = await fs.readdir(dir);
  if (!files.includes("package.json")) {
    console.log("plugin does not include a package.json file");
    throw new Error("plugin does not contain package.json");
  }
  let info = JSON.parse(await fs.readFile(dir + "/package.json", "utf8"));
  return {
    name: info.name,
    description: info.description,
    version: info.version,
  };
};

export const loadPlugins = (pluginsPaths: string[]) => {
  let plugins: Omit<Plugin, "name" | "version" | "description">[] = [];
  pluginsPaths.forEach((path) => {
    const mod = require(path);
    Object.keys(mod).forEach((fn) => {
      if (!(pluginApis as string[]).includes(fn)) {
        delete mod[fn];
      }
    });
    plugins.push({
      module: mod,
      path,
    });
  });

  return plugins;
};
