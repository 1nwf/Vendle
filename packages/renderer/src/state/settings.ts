import { batch } from "solid-js";
import { createMutable } from "solid-js/store";

const defaultLight = {
  editorBg: "bg-white",
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
export const settings = createMutable({
  allowEditing: true,
  menuItmes: [],
  lightTheme: true,
  theme: defaultLight,
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
});

export type ExtApi = "editorActions" | "editorProps" | "updateColorscheme";

export const plugins = createMutable<Record<ExtApi, any>>({
  editorActions: [],
  editorProps: [],
  updateColorscheme: [],
});

export const colorscheme = createMutable(
  settings.lightTheme ? defaultLight : defaultDark
);

export const changeColorscheme = (light: boolean) => {
  batch(() => {
    settings.theme = light ? defaultLight : defaultDark;
    settings.lightTheme = light;
  });
};

export const user = createMutable({
  name: "No User Name",
});
