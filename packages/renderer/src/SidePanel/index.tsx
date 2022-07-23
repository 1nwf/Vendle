import { createEffect, For } from "solid-js";
import File from "./File";
import CreateFile from "./CreateFile";
import { allFiles } from "../state/file";
import { colorscheme, settings } from "../state/settings";
import Workspace from "./Workspace";

export default function SidePanel() {
  return (
    <div class="mt-2">
      <Workspace />
      <div class="flex justify-center mb-4">
        <hr
          class={`w-10/12 ${
            settings.lightTheme ? "border-black" : "border-white"
          }`}
        />
      </div>
      <div class="px-4 rounded-r-2xl h-12/12  ">
        <h1 class="font-bold">Files</h1>
        <div class="h-[76vh] overflow-y-scroll">
          <For each={allFiles()}>
            {(f) => <File id={f.id} fileName={f.name} />}
          </For>
        </div>
      </div>
      <div class="flex justify-center w-full">
        <div class="absolute w-11/12 bottom-3">
          <CreateFile />
        </div>
      </div>
    </div>
  );
}
