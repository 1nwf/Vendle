export {};

interface Plugin {
  updateColorscheme: () => void;
}
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
