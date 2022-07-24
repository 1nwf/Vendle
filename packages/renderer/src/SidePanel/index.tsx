import { createSignal, For, Show } from "solid-js";
import { settings } from "../state/settings";
import Workspace from "./Workspace";
import AllFiles from "./files";

export default function SidePanel() {
  const [showAllFiles, setShowAllFiles] = createSignal(true);

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
      <Show when={showAllFiles()}>
        <div class="px-4 rounded-r-2xl h-12/12">
          <AllFiles />
        </div>
      </Show>
    </div>
  );
}
