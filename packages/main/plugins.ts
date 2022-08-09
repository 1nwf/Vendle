import { promises as fs } from "fs";
import { Plugin } from "../types/plugins";
import { PLUGINS_PATH } from "./constants";
import showdown from "showdown";

export const getPluginPaths = async () => {
  let paths: string[] = [];
  let plugins = await fs.readdir(PLUGINS_PATH);
  plugins.forEach((dir) => {
    if (dir.startsWith(".")) return;
    paths.push(PLUGINS_PATH + dir);
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
  let { vendle } = JSON.parse(await fs.readFile(dir + "/package.json", "utf8"));

  return {
    name: vendle.name,
    description: vendle.description,
    version: vendle.version,
    icon: "atom://" + vendle.icon,
    type: vendle.type,
  };
};

export const getPluginReadme = async (name: string) => {
  const readmePath = PLUGINS_PATH + name + "/README.md";
  const contents = await fs.readFile(readmePath, "ascii").catch((e) => "");
  const converter = new showdown.Converter();
  return converter.makeHtml(contents);
};

export const uninstallPlugin = async (name: string) => {
  return await fs.rmdir(PLUGINS_PATH + name, { recursive: true });
};
