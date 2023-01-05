import { createStore } from "solid-js/store";

export const [appState, setAppState] = createStore({
  themePickerShown: false,
  filePickerShown: false,
});

export const toggleShowFilePicker = () => {
  setAppState("filePickerShown", !appState.filePickerShown);
};

export const toggleShowThemePicker = () => {
  setAppState("themePickerShown", !appState.themePickerShown);
};
