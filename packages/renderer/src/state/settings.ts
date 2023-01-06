import { store } from "@/store";
import { createMutable } from "solid-js/store";
import { Plugin } from "../../../types/plugins";

export const settings = createMutable({
  ...window.settings,
  get theme() {
    return this.isLightTheme ? this.lightTheme : this.darkTheme;
  },
});

interface PluginsState {
  colorscheme: Plugin[];
  editor: Plugin[];
  needsReload: string[];
}
export const plugins: PluginsState = createMutable({
  colorscheme: [],
  editor: [],
  needsReload: [],
});

export const findPlugin = (name: string, type?: "colorscheme" | "editor") => {
  if (!type) {
    return (
      plugins.editor.find((p) => p.name === name) ??
        plugins.colorscheme.find((p) => p.name === name)
    );
  }
  return plugins[type].find((p) => p.name === name);
};

export const changeColorscheme = async (light: boolean) => {
  settings.isLightTheme = light;
  await persistSettings();
};

export const persistSettings = async () => {
  await store.set("settings", JSON.parse(JSON.stringify(settings)));
};
