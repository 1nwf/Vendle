import {
  Component,
  createEffect,
  createResource,
  onMount,
  Show,
} from "solid-js";
import Editor from "./editor";
import "./index.css";
import { initPlugins } from "./util/plugins";
import SidePanel from "./SidePanel";
import { file, setFile } from "./state/file";
import { settings } from "./state/settings";
import { store } from "./store";
import Titlebar from "./Titlebar";
import { BlockType } from "./types";
import { getFileContents } from "./util/files";

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
const fetchFileContents = async (id: string) => {
  if (!id) return;
  let contents = await getFileContents<BlockType>(id);
  setFile("contents", contents);
};

const DefaultHomeScreen = () => {
  return (
    <div
      class={`justify-center h-[25vh] items-center  flex w-11/12`}
      style={settings.theme.appFg}
    >
      <h1 class="text-4xl" style={settings.theme.appFg}>
        Choose a file
      </h1>
    </div>
  );
};

const App: Component = () => {
  createResource(() => file.id, fetchFileContents);

  onMount(async () => {
    await initPlugins();
  });

  createEffect(async () => {
    await loadSettings();
  });

  onMount(async () => {
    let userData = await getFileContents<{ name: string }>("settings");
    settings.username = userData.name;
  });

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
          <Show when={file.name} fallback={<DefaultHomeScreen />}>
            <Editor />
          </Show>
        </div>
      </div>
    </div>
  );
};

export default App;
