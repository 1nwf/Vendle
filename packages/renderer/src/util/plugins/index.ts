import { plugins, settings } from "../../state/settings";
import { pluginApis, Plugin } from "../../../../types/plugins";
import { ipcRenderer } from "electron";
import * as vendle from "./vendle";
import { generateStylesFromWindiClassName } from "@/util/styles";
import { store } from "@/store";
import { batch } from "solid-js";
import * as tiptap from "@tiptap/core";

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
      case "@tiptap/core":
        return tiptap;
      default:
        return originalRequire.apply(this, arguments);
    }
  };
};

patchRequire();

const getPluginInfo = async (dir: string) => {
  return await ipcRenderer.invoke("getPluginInfo", dir);
};

const loadPlugins = async () => {
  let plugins: Record<"colorscheme" | "editor", Plugin[]> = {
    colorscheme: [],
    editor: [],
  };
  const paths = await pluginPaths();
  await Promise.all(
    paths.map(async (path) => {
      const mod = require(path);
      const info = await getPluginInfo(path);
      Object.keys(mod).forEach((fn) => {
        if (!(pluginApis as string[]).includes(fn)) {
          delete mod[fn];
        }
      });
      let pluginInfo = {
        module: mod,
        name: info.name,
        displayName: info.displayName,
        description: info.description,
        version: info.version,
        type: info.type,
        icon: info.icon,
        author: info.author,
        updateAvailable: info.updateAvailable,
      };

      if (["colorscheme", "editor"].includes(info.type)) {
        let type = info.type as "colorscheme" | "editor";
        plugins[type].push(pluginInfo);
      }
    })
  );
  return plugins;
};
export const initPlugins = async () => {
  const loadedPlugins = await loadPlugins();
  batch(() => {
    plugins.colorscheme = loadedPlugins.colorscheme;
    plugins.editor = loadedPlugins.editor;
  });
};

export const loadStyles = (style: typeof settings.lightTheme, name: string) => {
  Object.keys(style).forEach((theme) => {
    let colors = style[theme];
    Object.keys(colors).forEach((type) => {
      const styles = generateStylesFromWindiClassName(colors[type]);
      settings[theme][type] = styles;
    });
  });
  settings.themeName = name;
  store.set("settings", settings);
};
