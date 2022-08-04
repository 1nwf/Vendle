import { createEffect, createSignal, on, onCleanup, Show } from "solid-js";
import { editorStyle, editorRef, editor, EditorDiv } from "@/state/editor";
import { settings } from "@/state/settings";
import { saveNote } from "@/util/files";
import { getCaretCoordinates } from "@/util/cursor";
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
        await saveNote();
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
    <div style={settings.theme.editorBg} class={`w-full`}>
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
