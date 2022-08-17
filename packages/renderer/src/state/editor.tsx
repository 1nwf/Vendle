import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import { createSignal } from "solid-js";
import { createMutable } from "solid-js/store";
import { createTiptapEditor, UseEditorOptions } from "solid-tiptap";
import { settings } from "./settings";
import { file } from "./file";

const CustomDocument = Document.extend({
  content: "heading block*",
});
export const editorStyle = () => {
  return `outline-none  pt-12 w-full lg:px-42 md:px-32 px-22 h-screen`;
};

const editorExtensions = createMutable([
  StarterKit.configure({ document: false }),
  CustomDocument,
]);
export const editorProps: Partial<UseEditorOptions<HTMLDivElement>> =
  createMutable({
    get extensions() {
      return editorExtensions;
    },
    editorProps: {
      attributes: {
        class: editorStyle(),
      },
      handleKeyPress(view, event) {
        return !settings.allowEditing;
      },
    },
  });

export const [fileContentsUpdate, setFileContentsUpdate] = createSignal(0);

export const updateFileContents = () => {
  setFileContentsUpdate(fileContentsUpdate() + 1);
};

export let editorRef;
export let EditorDiv = (
  <div
    id="editor"
    ref={editorRef}
    class="flex justify-center"
    style={settings.theme.editorFg}
  />
);
export const editor = createTiptapEditor({
  get element() {
    return editorRef;
  },
  content: file.contents,
  ...editorProps,
});
