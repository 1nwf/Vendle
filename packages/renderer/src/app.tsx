import { Component, createEffect, createResource, Show } from "solid-js";
import Editor from "./editor";
import "./index.css";
import { loadPlugins } from "./plugins";
import SidePanel from "./SidePanel";
import { file, setFile } from "./state/file";
import { settings, user } from "./state/settings";
import Titlebar from "./Titlebar";
import { BlockType } from "./types";
// import { loadExtensions } from "./util/extension";
import { getFileContents } from "./util/files";

const fetchFileContents = async (id: string) => {
  if (!id) return;
  let contents = await getFileContents<BlockType>(id);

  setFile("contents", contents);
};

const DefaultHomeScreen = () => {
  return (
    <div
      class={`justify-center h-[25vh] items-center ${settings.theme.appFg} flex w-11/12`}
    >
      <h1 class="text-4xl">Choose a file</h1>
    </div>
  );
};

const App: Component = () => {
  createResource(() => file.id, fetchFileContents);

  createEffect(() => {
    loadPlugins();
  });

  createEffect(async () => {
    let userData = await getFileContents<{ name: string }>("settings");
    user.name = userData.name;
  });

  return (
    <div
      class={`h-screen ${settings.theme.appBg} overflow-x-hidden ${settings.theme.appFg}`}
    >
      <Titlebar />
      <div class="h-full w-screen">
        <div
          class={`float-left h-screen ${settings.theme.sidePanelBg} pt-6 absolute top-0 hidden lg:(block w-2/12)`}
        >
          <SidePanel />
        </div>
        <div class="w-12/12 md:(w-10/12 float-right) select-text">
          <Show when={file.name} fallback={<DefaultHomeScreen />}>
            <Editor />
          </Show>
        </div>
      </div>
    </div>
  );
};

export default App;
