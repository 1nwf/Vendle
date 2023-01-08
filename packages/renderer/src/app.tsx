import { Component, createEffect, createSignal, Show } from "solid-js";
import "./index.css";
import { useRoutes } from "@solidjs/router";
import { routes } from "./routes";
import Titlebar from "./components/titlebar";
import { persistSettings, settings } from "./state/settings";
import SidePanel from "./components/sidepanel";
import { globalCss } from "@hope-ui/solid";
import { ipcRenderer } from "electron";
import useResize from "./hooks/useResize";
import { openFileInfo } from "./util/files";
import Pickers from "./components/selector";
import { handleKeyboardShortcuts } from "./hooks/useKeyboardShortcut";

const App: Component = () => {
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

  createEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcuts);
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

  const [sidebarWidth, setSidbarWidth] = createSignal(0);
  let resizeRef: any;
  createEffect(() => {
    const w = useResize(resizeRef);
    createEffect(() => {
      if (w() != 0 && w() > 200) {
        setSidbarWidth(w());
      }
    });
  });

  window.onbeforeunload = (e) => {
    ipcRenderer.send("appQuit", ...openFileInfo());
  };

  return (
    <div style={settings.theme.appBg + settings.theme.appFg} class={`h-screen`}>
      <Titlebar />
      <Pickers />
      <div class="h-full">
        <Show when={settings.sidepanelShown}>
          <div
            style={`${settings.theme.sidePanelBg}; ${
              sidebarWidth() && `width: ${sidebarWidth()}px;`
            }`}
            class={`float-left h-full md:(w-3/12) w-2/5 lg:(w-1/5) z-50 max-w-[350px] flex`}
          >
            <SidePanel />
            <div>
              <div
                class="w-1 fixed h-full z-50 ml-auto active:(bg-gray-300) hover:(bg-gray-300 cursor-move)"
                ref={resizeRef}
              >
              </div>
            </div>
          </div>
        </Show>

        <Routes />
      </div>
    </div>
  );
};

export default App;
