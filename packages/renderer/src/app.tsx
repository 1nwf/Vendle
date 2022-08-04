import { Component, onMount } from "solid-js";
import "./index.css";
import { useRoutes } from "@solidjs/router";
import { routes } from "./routes";
import Titlebar from "./components/titlebar";
import { settings } from "./state/settings";
import { initPlugins } from "./util/plugins";
import { store } from "./store";
import SidePanel from "./components/sidepanel";

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

  return (
    <div style={settings.theme.appBg + settings.theme.appFg} class={`h-screen`}>
      <Titlebar />
      <div class="h-full w-screen">
        <div
          style={settings.theme.sidePanelBg}
          class={`float-left h-screen pt-6 absolute top-0 hidden lg:(block w-1/5)`}
        >
          <SidePanel />
        </div>
        <div
          style={settings.theme.editorBg}
          class={`w-12/12 lg:(w-4/5 float-right) select-text h-screen overflow-y-auto`}
        >
          <Routes />
        </div>
      </div>
    </div>
  );
};

export default App;
