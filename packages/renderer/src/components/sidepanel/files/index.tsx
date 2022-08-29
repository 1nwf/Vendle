import { allFiles } from "@/state/file";
import { settings } from "@/state/settings";
import { createEffect, createSignal, For, Show } from "solid-js";
import CreateFile from "../CreateFile";
import File from "./File";
import { Icon } from "solid-heroicons";
import { plus } from "solid-heroicons/outline";
import handleOutsideClick from "@/hooks/handleOutsideClick";

export default function AllFiles() {
  const [showCreateFile, setShowCreateFile] = createSignal(false);

  let createFileRef;
  const handleShowCreateFile = () => {
    setShowCreateFile(!showCreateFile());
    if (showCreateFile()) {
      createFileRef.focus();
    }
  };
  const closeHandler = () => {
    setShowCreateFile(false);
  };
  createEffect(() => {
    if (showCreateFile()) {
      handleOutsideClick(createFileRef, closeHandler);
    }
  });
  return (
    <div>
      <div class="flex items-center">
        <h1 class="font-bold" style={settings.theme.sidePanelFg}>
          Files
        </h1>
        <div
          class="ml-auto hover:(cursor-pointer bg-opacity-60)"
          onClick={() => handleShowCreateFile()}
        >
          <Icon path={plus} class="h-4 w-4 mr-1" stroke-width={2} />
        </div>
      </div>
      <div class="h-[76vh] overflow-y-auto mt-4">
        <For each={allFiles()}>
          {(f) => <File id={f.id} fileName={f.name} />}
        </For>

        <Show when={showCreateFile()}>
          <CreateFile closeHandler={closeHandler} ref={createFileRef} />
        </Show>
      </div>
    </div>
  );
}
