import useKeyboardShortcut, { Modifier } from "@/hooks/useKeyboardShortcut";
import { createEffect, Show } from "solid-js";
import { createMutable } from "solid-js/store";
import FilePicker from "./FileSelector";
import ThemeSelector from "./ThemeSelector";

export default function Pickers() {
  const pickerState = createMutable({
    filePickerShown: false,
    themePickerShown: false,
  });
  const togglePicker = (picker: keyof typeof pickerState) => {
    const values = Object.keys(pickerState).filter((p) => p != picker);
    values.forEach((v) => {
      const p = v as keyof typeof pickerState;
      pickerState[p] = false;
    });
    pickerState[picker] = !pickerState[picker];
  };

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
      <Show when={pickerState.themePickerShown}>
        <ThemeSelector closeHandler={() => togglePicker("themePickerShown")} />
      </Show>
      <Show when={pickerState.filePickerShown}>
        <FilePicker closeHandler={() => togglePicker("filePickerShown")} />
      </Show>
    </div>
  );
}
