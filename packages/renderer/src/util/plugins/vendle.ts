import { editorExtensions, setEditorExtensions } from "@/state/editor";

export { settings } from "@/state/settings";
export { editor } from "@/state/editor";
export { changeColorscheme } from "@/state/settings";

export const registerEditorExtension = (extension: any) => {
  setEditorExtensions([...editorExtensions(), extension]);
};
