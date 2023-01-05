import useKeyboardShortcut, { Modifier } from "@/hooks/useKeyboardShortcut";
import { appState, togglePicker } from "@/state/app";
import { createEffect, Show } from "solid-js";
import FilePicker from "./FileSelector";
import ThemeSelector from "./ThemeSelector";

export default function Pickers() {
  const shortcuts = [
    {
      modifier: Modifier.Meta,
      key: "k",
      handler: () => togglePicker("themePickerShown"),
    },
    {
      modifier: Modifier.Meta,
      key: "f",
      handler: () => togglePicker("filePickerShown"),
    },
  ];

  createEffect(() => {
    shortcuts.forEach((s) => useKeyboardShortcut(s));
  });
  return (
    <div>
      <Show when={appState.pickers.themePickerShown}>
        <ThemeSelector closeHandler={() => togglePicker("themePickerShown")} />
      </Show>
      <Show when={appState.pickers.filePickerShown}>
        <FilePicker closeHandler={() => togglePicker("filePickerShown")} />
      </Show>
    </div>
  );
}
