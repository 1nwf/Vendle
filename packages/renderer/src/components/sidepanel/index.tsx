import { createSignal, Show } from "solid-js";
import { settings } from "@/state/settings";
import Workspace from "./Workspace";
import AllFiles from "./files";
import Plugins from "./plugins";
import { Icon } from "solid-heroicons";

import { cube } from "solid-heroicons/outline";
import { useNavigate } from "@solidjs/router";
export default function SidePanel() {
  const [showExtensionsPage, setShowExtensionsPage] = createSignal(false);
  const [showAllFiles, setShowAllFiles] = createSignal(true);
  const navigate = useNavigate();

  const handleShowExtensions = () => {
    setShowAllFiles(!showAllFiles());
    setShowExtensionsPage(!showExtensionsPage());
    if (showExtensionsPage()) {
      navigate("/plugins");
    } else {
      navigate("/");
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

      <div class="absolute bottom-2 left-3">
        <div class="flex">
          <div onClick={handleShowExtensions}>
            <Icon
              path={cube}
              class="h-6 w-6 mr-auto hover:cursor-pointer"
              stroke-width={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
