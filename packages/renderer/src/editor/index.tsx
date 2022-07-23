import { createTiptapEditor } from "solid-tiptap";
import { createEffect, createSignal, on, onCleanup, Show } from "solid-js";
import { editorProps, fileContentsUpdate } from "../state/editor";
import { plugins, settings } from "../state/settings";
import { file, setFile } from "../state/file";
import { saveFile } from "../util/files";
import { getCaretCoordinates } from "../util/cursor";
import { OverlayCommandsPopup } from "./overlayCommandsPopup";

export default function Editor() {
  let ref!: HTMLDivElement;

  const [cursorCoordinates, setCursorCoordinates] = createSignal({
    x: null,
    y: null,
  });
  const [showCommandsPopup, setShowCommandsPopup] = createSignal(false);

  const editor = createTiptapEditor({
    get element() {
      return ref;
    },
    content: file.contents,
    ...editorProps,
  });

  const openCommandsPopup = () => {
    setCursorCoordinates(getCaretCoordinates());
    setShowCommandsPopup(true);
  };

  const handleKeyDown = async (e) => {
    if (e.metaKey && e.key === "s") {
      e.preventDefault();
      let instance = editor();
      if (instance != undefined) {
        await saveFile(file.id, file.name, instance.getJSON());
      }
    }

    if (e.key == "/") {
      openCommandsPopup();
    }
  };
  createEffect(() => {
    const instance = editor();
    if (instance) {
      instance.commands.focus();
      plugins.editorActions.forEach((fn) => {
        fn(instance);
      });
    }
  });

  createEffect(() => {
    ref.addEventListener("keydown", handleKeyDown);
  });

  createEffect(
    on(
      () => file.name,
      () => {
        if (editor()) {
          editor().commands.focus();
        }
      }
    )
  );

  createEffect(
    on(fileContentsUpdate, (c) => {
      if (c == 0) return;
      setFile("contents", editor().getJSON());
    })
  );

  createEffect(
    on(
      () => settings.lightTheme,
      () => {
        const editorStyle = `outline-none ${settings.theme.editorFg} ${settings.theme.editorBg} pt-10 text-left rounded-xl h-[100vh] inline-block w-full pl-[10vw] pr-[15vw] mb-10`;
        if (!editor()) return;
        editor().setOptions({
          editorProps: {
            attributes: {
              class: editorStyle,
            },
          },
        });
      }
    )
  );
  createEffect(() => {
    if (!editor()) return;
    const editorStyle = `outline-none ${settings.theme.editorFg} ${settings.theme.editorBg} pt-10 text-left rounded-xl h-[100vh] inline-block w-full pl-[10vw] pr-[15vw] mb-10`;
    editor().setOptions({
      editorProps: {
        attributes: {
          class: editorStyle,
        },
      },
    });
  });
  onCleanup(() => {
    ref.removeEventListener("keydown", handleKeyDown);
  });

  const selectionHandler = (tag) => {};
  const closeCommandsPopup = () => {
    setShowCommandsPopup(false);
  };
  return (
    <div class="mx-[1.5vw] md:(ml-0 mr-[1vw]) mb-10">
      <Show when={showCommandsPopup()}>
        <OverlayCommandsPopup
          position={cursorCoordinates()}
          selectionHandler={selectionHandler}
          closeHandler={closeCommandsPopup}
        />
      </Show>
      <div id="editor" ref={ref} class="" />
    </div>
  );
}
