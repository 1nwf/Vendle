export interface Module {
  updateColorscheme: () => void;
  editorActions: () => void;
  editorProps: () => void;
}
export interface Plugin {
  name: string;
  version: string;
  description: string;
  path: string;
  module: Module;
}
