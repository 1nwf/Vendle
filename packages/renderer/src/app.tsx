import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
import "./index.css";
import { useRoutes } from "@solidjs/router";
import { routes } from "./routes";
import Titlebar from "./components/titlebar";
import { persistSettings, settings } from "./state/settings";
import { initPlugins } from "./util/plugins";
import { store } from "./store";
import SidePanel from "./components/sidepanel";
import { globalCss } from "@hope-ui/solid";
import { appState, showThemePicker } from "./state/app";
import ThemeSelector from "./components/plugins/theme/ThemeSelector";
import { ipcRenderer } from "electron";

const loadSettings = async () => {
  const loadedSettings = await store.get("settings");
  if (settings) {
    Object.keys(loadedSettings).forEach((key) => {
      let k = key as keyof typeof settings;
      if (k == "theme") return;
      settings[k] = loadedSettings[k];
    });
  }
};

const App: Component = () => {
  onMount(async () => {
    await initPlugins();
  });
  onMount(async () => {
    await loadSettings();
  });

  const Routes = useRoutes(routes);
  const styles = globalCss({
    h1: {
      fontSize: "1.875rem",
      lineHeight: " 2.25rem",
      fontWeight: "bold",
    },
    h2: {
      fontSize: "1.5rem",
      lineHeight: " 2rem",
      fontWeight: "bold",
    },
    h3: {
      fontSize: "1.25rem",
      lineHeight: "1.75rem",
      fontWeight: "bold",
    },
  });

  styles();
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.code == "KeyK") {
      showThemePicker(!appState.themePickerShown);
    }
  };
  createEffect(() => {
    document.addEventListener("keydown", handleKeydown);
  });
  const openSidepanel = async () => {
    settings.sidepanelShown = true;
    await persistSettings();
  };
  const [fullscreen, setFullScreen] = createSignal(false);
  createEffect(() => {
    ipcRenderer.on("fullscreen", () => {
      setFullScreen(true);
    });
    ipcRenderer.on("leave-fullscreen", () => {
      setFullScreen(false);
    });
  });
  return (
    <div style={settings.theme.appBg + settings.theme.appFg} class={`h-screen`}>
      <Titlebar />
      <Show when={appState.themePickerShown}>
        <ThemeSelector closeHandler={() => showThemePicker(false)} />
      </Show>
      <div class="h-full w-screen">
        <Show when={settings.sidepanelShown}>
          <div
            style={settings.theme.sidePanelBg}
            class={`float-left h-screen ${
              !fullscreen() && "pt-6"
            } absolute top-0 block md:(w-3/12) w-2/5 lg:(w-1/5) z-50`}
          >
            <SidePanel />
          </div>
        </Show>

        <Show when={!settings.sidepanelShown}>
          <div
            class={`float-left h-screen mt-12 z-50 absolute top-0`}
            style={settings.theme.editorBg}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 ml-3 hover:cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={async () => await openSidepanel()}
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Show>

        <div
          style={settings.theme.editorBg}
          class={`${
            settings.sidepanelShown
              ? "lg:(w-4/5) md:(w-9/12) w-3/5 float-right"
              : "w-12/12"
          } select-text h-screen overflow-y-auto`}
        >
          <Routes />
        </div>
      </div>
    </div>
  );
};

export default App;
