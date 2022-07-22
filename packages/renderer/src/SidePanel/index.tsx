import { createEffect, For } from "solid-js";
import File from "./File";
import CreateFile from "./CreateFile";
import { allFiles } from "../state/file";
import { colorscheme, settings } from "../state/settings";
import Workspace from "./Workspace";

export default function SidePanel() {
  return (
    <div class="h-[80vh] mt-2">
      <Workspace />
      <div class="flex justify-center ">
        <hr class="w-10/12" />
      </div>
      <div
        class={` ${settings.theme.sidePanelBg} p-4 rounded-r-2xl h-12/12 overflow-x-hidden ${settings.theme.sidePanelFg}`}
      >
        <h1 class="font-bold">Files</h1>
        <For each={allFiles()}>
          {(f) => <File id={f.id} fileName={f.name} />}
        </For>
        <div class="sticky bottom-0">
          <CreateFile />
        </div>
      </div>
    </div>
  );
}
