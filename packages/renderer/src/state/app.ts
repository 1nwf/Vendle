import { createStore } from "solid-js/store";

export const [appState, setAppState] = createStore({
  themePickerShown: false,
  filePickerShown: false,
});

const closeAllPickers = (except?: keyof typeof appState) => {
  const values = Object.keys(appState).filter((p) => p != except);
  values.forEach((v) => setAppState(v as keyof typeof appState, false));
};
export const toggleShowFilePicker = () => {
  closeAllPickers("filePickerShown");
  setAppState("filePickerShown", !appState.filePickerShown);
};

export const toggleShowThemePicker = () => {
  closeAllPickers("themePickerShown");
  setAppState("themePickerShown", !appState.themePickerShown);
};
