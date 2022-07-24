import { createEffect, createSignal, For, Show } from "solid-js";
import File from "./File";
import CreateFile from "./CreateFile";
import { allFiles } from "../state/file";
import { colorscheme, settings } from "../state/settings";
import Workspace from "./Workspace";
import Extensions from "./Extensions";

export default function SidePanel() {
  const [showCreateFile, setShowCreateFile] = createSignal(false);
  let createFileRef;
  const showCreateFileHandler = () => {
    setShowCreateFile(!showCreateFile());
    if (showCreateFile()) {
      createFileRef.focus();
    }
  };

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
      <div class="px-4 rounded-r-2xl h-12/12">
        <div class="flex items-center">
          <h1 class="font-bold">Files</h1>
          <div
            class="ml-auto hover:(cursor-pointer bg-opacity-60)"
            onClick={() => showCreateFileHandler()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width={2}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
        <div class="h-[76vh] overflow-y-auto mt-4">
          <For each={allFiles()}>
            {(f) => <File id={f.id} fileName={f.name} />}
          </For>

          <Show when={showCreateFile()}>
            <CreateFile
              closeHandler={() => setShowCreateFile(false)}
              ref={createFileRef}
            />
          </Show>
        </div>
      </div>
    </div>
  );
}
