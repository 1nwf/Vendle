import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import { createSignal } from "solid-js";
import { createMutable } from "solid-js/store";
import { UseEditorOptions } from "solid-tiptap";
import { settings } from "./settings";

const CustomDocument = Document.extend({
  content: "heading block*",
});

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
        class: `outline-none ${settings.theme.editorFg} ${settings.theme.editorBg} pt-10 text-left rounded-xl h-[100vh] inline-block w-full pl-[10vw] pr-[15vw] mb-10`,
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
