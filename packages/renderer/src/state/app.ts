import { createStore } from "solid-js/store";

export const [appState, setAppState] = createStore({
  themePickerShown: false,
});

export const showThemePicker = (show: boolean) => {
  setAppState("themePickerShown", show);
};
