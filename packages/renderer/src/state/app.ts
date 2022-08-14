import { createStore } from "solid-js/store";

export const [appState, setAppState] = createStore({
  themePickerShown: false,
  sidepanelShown: true,
});

export const showThemePicker = (show: boolean) => {
  setAppState("themePickerShown", show);
};
