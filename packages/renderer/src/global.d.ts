export {};

export interface Module {
  updateColorscheme: () => void;
  editorActions: () => void;
  editorActionsCleanup: () => void;
  editorProps: () => void;
}
export interface Plugin {
  name: string;
  version: string;
  description: string;
  path: string;
  module: Module;
}
// import { Plugin } from "./plugins/index";
declare global {
  interface Window {
    // Expose some Api through preload script
    fs: typeof import("fs");
    ipcRenderer: import("electron").IpcRenderer;
    removeLoading: () => void;
    getPluginPaths: () => Promise<string[]>;
    loadPlugins: (paths: string[]) => Plugin[];
    saveFile: (id: string, contents: string) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    getFileContents: (name: string) => Promise<any>;
  }
}
