import { createSignal, Show } from "solid-js";
import { settings } from "@/state/settings";
import Workspace from "./Workspace";
import ShowPlugins from "./plugins/ShowPlugins";
import AllFiles from "./files";
import Plugins from "./plugins";

export default function SidePanel() {
  const [showExtensionsPage, setShowExtensionsPage] = createSignal(false);
  const [showAllFiles, setShowAllFiles] = createSignal(true);

  const handleShowExtensions = () => {
    setShowAllFiles(!showAllFiles());
    setShowExtensionsPage(!showExtensionsPage());
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
      <Show when={showAllFiles()}>
        <div class="px-4 rounded-r-2xl h-12/12">
          <AllFiles />
        </div>
      </Show>
      <Show when={showExtensionsPage()}>
        <div class="px-4 rounded-r-2xl h-12/12">
          <Plugins />
        </div>
      </Show>

      <div class="absolute bottom-5">
        <div class="flex mx-4 ">
          <ShowPlugins onClick={() => handleShowExtensions()} />
        </div>
      </div>
    </div>
  );
}