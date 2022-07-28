import { Component, createResource, onMount, Show } from "solid-js";
import Editor from "./editor";
import "./index.css";
import { initPlugins } from "./plugins";
import SidePanel from "./SidePanel";
import { file, setFile } from "./state/file";
import { plugins, settings } from "./state/settings";
import Titlebar from "./Titlebar";
import { BlockType } from "./types";
import { getFileContents } from "./util/files";

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
      <h1 class="text-4xl">Choose a file</h1>
    </div>
  );
};

const App: Component = () => {
  createResource(() => file.id, fetchFileContents);

  onMount(async () => {
    await initPlugins();
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
