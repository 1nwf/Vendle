import { app } from "electron";
import { promises as fs } from "fs";
import { Plugin } from "../types/plugins";

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
    throw new Error("plugin does not contain package.json");
  }
  let info = JSON.parse(await fs.readFile(dir + "/package.json", "utf8"));
  return {
    name: info.name,
    description: info.description,
    version: info.version,
    type: info.type,
  };
};
