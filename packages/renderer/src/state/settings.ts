import { store } from "@/store";
import { createMutable } from "solid-js/store";
import { Plugin } from "../../../types/plugins";

const defaultLight = {
  editorBg:
    "--tw-bg-opacity: 1;background-color: rgba(243, 244, 246, var(--tw-bg-opacity));",
  editorFg:
    "--tw-text-opacity: 1;color: rgba(55, 65, 81, var(--tw-text-opacity));",
  editorFont:
    'font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";',
  appBg:
    "--tw-bg-opacity: 1;background-color: rgba(255, 255, 255, var(--tw-bg-opacity));",
  appFg: "--tw-text-opacity: 1;color: rgba(0, 0, 0, var(--tw-text-opacity));",
  sidePanelBg:
    "--tw-bg-opacity: 1;background-color: rgba(229, 231, 235, var(--tw-bg-opacity));",
  sidePanelFg:
    "--tw-text-opacity: 1;color: rgba(0, 0, 0, var(--tw-text-opacity));",
  commandsPopupBg:
    "--tw-bg-opacity: 1;background-color: rgba(209, 213, 219, var(--tw-bg-opacity));",
  commandsPopupFg:
    "--tw-text-opacity: 1;color: rgba(0, 0, 0, var(--tw-text-opacity));",
};
const defaultDark = {
  editorBg:
    "--tw-bg-opacity: 1;background-color: rgba(31, 41, 55, var(--tw-bg-opacity));",
  editorFg:
    "--tw-text-opacity: 1;color: rgba(229, 231, 235, var(--tw-text-opacity));",
  editorFont:
    'font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";',
  appBg:
    "--tw-bg-opacity: 1;background-color: rgba(31, 41, 55, var(--tw-bg-opacity));",
  appFg:
    "--tw-text-opacity: 1;color: rgba(229, 231, 235, var(--tw-text-opacity));",
  sidePanelBg:
    "--tw-bg-opacity: 1;background-color: rgba(17, 24, 39, var(--tw-bg-opacity));",
  sidePanelFg:
    "--tw-text-opacity: 1;color: rgba(229, 231, 235, var(--tw-text-opacity));",
  commandsPopupBg:
    "--tw-bg-opacity: 1;background-color: rgba(209, 213, 219, var(--tw-bg-opacity));",
  commandsPopupFg:
    "--tw-text-opacity: 1;color: rgba(0, 0, 0, var(--tw-text-opacity));",
};

export const settings = createMutable({
  allowEditing: true,
  menuItmes: [],
  isLightTheme: true,
  lightTheme: defaultLight,
  darkTheme: defaultDark,
  overLayPopupCommands: [
    {
      tag: "h1",
      name: "title",
    },
    {
      tag: "h2",
      name: "heading",
    },
    {
      tag: "h3",
      name: "subheading",
    },
    {
      tag: "p",
      name: "paragraph",
    },
    {
      tag: "li",
      name: "list",
    },
  ],
  username: "No User Name",
  themeName: "default",
  sidepanelShown: true,
  pfpPath: "",
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
