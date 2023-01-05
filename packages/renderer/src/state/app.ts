import { createStore } from "solid-js/store";

export const [appState, setAppState] = createStore({
  pickers: { themePickerShown: false, filePickerShown: false },
});

const closeAllPickers = (except?: keyof typeof appState.pickers) => {
  const values = Object.keys(appState.pickers).filter((p) => p != except);
  values.forEach((v) =>
    setAppState("pickers", v as keyof typeof appState.pickers, false)
  );
};

export const togglePicker = (picker: keyof typeof appState.pickers) => {
  closeAllPickers(picker);
  setAppState("pickers", picker, !appState.pickers[picker]);
};
