interface Colorscheme {
  editorBg: string;
  editorFg: string;
  editorFont: string;
  appBg: string;
  appFg: string;
  sidePanelBg: string;
  sidePanelFg: string;
  commandsPopupBg: string;
  commandsPopupFg: string;
}
interface Theme {
  lightTheme: Colorscheme;
  darkTheme: Colorscheme;
}
export interface Module {
  main: () => void;
  setColorscheme: () => Theme;
  cleanupEditorActions: () => void;
  setEditorOptions: () => void;
}
export interface Plugin {
  name: string;
  version: string;
  description: string;
  path: string;
  icon: any;
  module: Partial<Module>;
  type: string;
}

export const pluginApis: (keyof Module)[] = [
  "main",
  "setColorscheme",
  "cleanupEditorActions",
  "setEditorOptions",
];
export type PluginApi = keyof Module;
