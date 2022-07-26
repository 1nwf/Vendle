import { createEffect, createSignal, on, onCleanup, Show } from "solid-js";
import {
  editorStyle,
  fileContentsUpdate,
  editor,
  EditorDiv,
  editorRef,
} from "../state/editor";
import { plugins, settings } from "../state/settings";
import { file, setFile } from "../state/file";
import { saveFile } from "../util/files";
import { getCaretCoordinates } from "../util/cursor";
import { OverlayCommandsPopup } from "./overlayCommandsPopup";

export default function Editor() {
  const [cursorCoordinates, setCursorCoordinates] = createSignal({
    x: null,
    y: null,
  });
  const [showCommandsPopup, setShowCommandsPopup] = createSignal(false);

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
    }
  });

  createEffect(() => {
    editorRef.addEventListener("keydown", handleKeyDown);
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
        if (!editor()) return;
        editor().setOptions({
          editorProps: {
            attributes: {
              class: editorStyle(),
            },
          },
        });
      }
    )
  );
  createEffect(() => {
    if (!editor()) return;
    editor().setOptions({
      editorProps: {
        attributes: {
          class: editorStyle(),
        },
      },
    });
  });
  onCleanup(() => {
    editorRef.removeEventListener("keydown", handleKeyDown);
  });

  const selectionHandler = (tag) => {};
  const closeCommandsPopup = () => {
    setShowCommandsPopup(false);
  };
  return (
    <div class={`w-full ${settings.theme.editorBg}`}>
      <Show when={showCommandsPopup()}>
        <OverlayCommandsPopup
          position={cursorCoordinates()}
          selectionHandler={selectionHandler}
          closeHandler={closeCommandsPopup}
        />
      </Show>
      {EditorDiv}
    </div>
  );
}
