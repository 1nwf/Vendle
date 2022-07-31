import { matchSorter } from "match-sorter";
import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { settings } from "@/state/settings";

interface Props {
  selectionHandler: (tag: string) => void;
  position: { x: number; y: number };
  closeHandler: () => void;
}
export const OverlayCommandsPopup = ({
  selectionHandler,
  position,
  closeHandler,
}: Props) => {
  const [command, setCommand] = createSignal("");
  const [selection, setSelection] = createSignal(0);
  const [selectionList, setSelectionList] = createSignal(
    settings.overLayPopupCommands
  );

  createEffect(() => {
    setSelectionList(
      matchSorter(settings.overLayPopupCommands, command(), {
        keys: ["tag", "name"],
      })
    );
  });

  const keyDownHandler = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      selectionHandler(selectionList()[selection()].tag);
      closeHandler();
    } else if (e.key == "ArrowDown" || e.key == "Tab") {
      e.preventDefault();
      setSelection(
        selection() == selectionList().length - 1 ? 0 : selection() + 1
      );
    } else if (e.key == "ArrowUp") {
      e.preventDefault();
      setSelection(
        selection() == 0 ? selectionList().length - 1 : selection() - 1
      );
    } else if (e.key == "Backspace") {
      if (command()) {
        setCommand(command().slice(0, -1));
      } else closeHandler();
    } else {
      setCommand(command() + e.key);
    }
  };

  document.addEventListener("keydown", keyDownHandler);
  onCleanup(() => {
    document.removeEventListener("keydown", keyDownHandler);
  });

  let divRef;
  createEffect(() => {
    divRef.focus();
  });
  return (
    <div
      class={`rounded-xl w-min p-2 absolute flex flex-col justify-start z-50`}
      style={`left: ${position.x}px;top: ${position.y + 25}px; ${
        settings.theme.commandsPopupBg
      }`}
      ref={divRef}
    >
      <Show
        when={selectionList().length > 0}
        fallback={
          <p class={`text-sm w-max`} style={settings.theme.commandsPopupFg}>
            results empty
          </p>
        }
      >
        <For each={selectionList()}>
          {(command) => (
            <div
              onClick={() => setCommand(command.tag)}
              class={`${
                selectionList()[selection()].tag == command.tag
                  ? "bg-gray-400"
                  : ""
              } py-1 px-2 rounded-md`}
            >
              <p class={`text-sm`} style={settings.theme.commandsPopupFg}>
                {command.name}
              </p>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};
