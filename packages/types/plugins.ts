export interface Module {
  setColorscheme: () => void;
  editorProps: () => void;
}
export interface Plugin {
  name: string;
  version: string;
  description: string;
  path: string;
  module: Partial<Module>;
}

export const pluginApis: (keyof Module)[] = ["editorProps", "setColorscheme"];
export type PluginApi = keyof Module;
