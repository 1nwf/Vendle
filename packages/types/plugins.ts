export interface Module {
  main: () => void;
  setColorscheme: () => void;
  cleanupEditorActions: () => void;
  setEditorOptions: () => void;
}
export interface Plugin {
  name: string;
  version: string;
  description: string;
  path: string;
  module: Partial<Module>;
}

export const pluginApis: (keyof Module)[] = [
  "main",
  "setColorscheme",
  "cleanupEditorActions",
  "setEditorOptions",
];
export type PluginApi = keyof Module;
