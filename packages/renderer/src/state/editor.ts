import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import { createSignal } from "solid-js";
import { createMutable } from "solid-js/store";
import { UseEditorOptions } from "solid-tiptap";
import { settings } from "./settings";

const CustomDocument = Document.extend({
  content: "heading block*",
});
export const editorStyle = () => {
  return `outline-none ${settings.theme.editorFg} ${settings.theme.editorBg} pt-12 w-full lg:pl-[12vw] pl-[18vw] pr-[15vw] h-screen`;
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
