import { plugins, settings } from "../../state/settings";
import { pluginApis, Plugin } from "../../../../types/plugins";
import { ipcRenderer } from "electron";
import * as vendle from "./vendle";
import { generateStylesFromWindiClassName } from "@/util/styles";
import { store } from "@/store";

const pluginPaths = async () => {
  const paths: string[] = await ipcRenderer.invoke("get-plugins-path");
  return paths;
};

const patchRequire = () => {
  const Module = require("module");
  const originalRequire = Module._load;
  Module._load = function _load(modulePath: string) {
    switch (modulePath) {
      case "vendle":
        return vendle;
      case "fs":
      case "electron":
        return undefined;
      default:
        return originalRequire.apply(this, arguments);
    }
  };
};

patchRequire();

const getPluginInfo = async (dir: string) => {
  return await ipcRenderer.invoke("getPluginInfo", dir);
};

export const loadPlugins = async () => {
  let plugins: Plugin[] = [];
  const paths = await pluginPaths();
  paths.forEach((path) => {
    const mod = require(path);
    Object.keys(mod).forEach((fn) => {
      if (!(pluginApis as string[]).includes(fn)) {
        delete mod[fn];
      }
    });
    plugins.push({
      module: mod,
      name: "",
      description: "",
      version: "",
      type: "",
      icon: "",
      path,
    });
  });

  plugins = await Promise.all(
    plugins.map(async (p) => {
      const info = await getPluginInfo(p.path);
      return { ...p, ...info };
    })
  );
  return plugins;
};
export const initPlugins = async () => {
  const loadedPlugins = await loadPlugins();
  loadedPlugins.forEach((plugin) => {
    plugins.push(plugin);
  });
};

export const loadStyles = (style: typeof settings.lightTheme) => {
  Object.keys(style).forEach((theme) => {
    let colors = style[theme];
    Object.keys(colors).forEach((type) => {
      const styles = generateStylesFromWindiClassName(colors[type]);
      settings[theme][type] = styles;
    });
  });
  store.set("settings", settings);
};
