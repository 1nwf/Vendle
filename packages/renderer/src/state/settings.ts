import { store } from "@/store";
import { createMutable } from "solid-js/store";
import { Plugin } from "../../../types/plugins";

export const settings = createMutable({
  ...window.settings,
  get theme() {
    return this.isLightTheme ? this.lightTheme : this.darkTheme;
  },
});

export const plugins: Record<"colorscheme" | "editor", Plugin[]> =
  createMutable({
    colorscheme: [],
    editor: [],
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

export const changeColorscheme = (light: boolean) => {
  settings.isLightTheme = light;
  store.set("settings", settings);
};

export const persistSettings = async () => {
  await store.set("settings", settings);
};
