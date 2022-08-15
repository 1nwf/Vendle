import { store } from "@/store";
import { generateStylesFromWindiClassName } from "@/util/styles";
import { createMutable } from "solid-js/store";
import { Plugin } from "../../../types/plugins";

const defaultLight = {
  editorBg: "bg-gray-100",
  editorFg: "text-gray-700",
  editorFont: "font-sans",
  appBg: "bg-white",
  appFg: "text-black",
  sidePanelBg: "bg-gray-200",
  sidePanelFg: "text-black",
  commandsPopupBg: "bg-gray-300",
  commandsPopupFg: "text-black",
};

const defaultDark = {
  editorBg: "bg-gray-800",
  editorFg: "text-gray-200",
  editorFont: "font-sans",
  appBg: "bg-gray-800",
  appFg: "text-gray-200",
  sidePanelBg: "bg-gray-900",
  sidePanelFg: "text-gray-200",
  commandsPopupBg: "bg-gray-300",
  commandsPopupFg: "text-black",
};
Object.keys(defaultLight).forEach((key) => {
  let k = key as keyof typeof defaultDark;
  defaultLight[k] = generateStylesFromWindiClassName(defaultLight[k]);
  defaultDark[k] = generateStylesFromWindiClassName(defaultDark[k]);
});

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
  get theme() {
    return this.isLightTheme ? this.lightTheme : this.darkTheme;
  },
});

export const plugins: Plugin[] = createMutable([]);

export const changeColorscheme = (light: boolean) => {
  settings.isLightTheme = light;
  store.set("settings", settings);
};

export const persistSettings = async () => {
  await store.set("settings", settings);
};
