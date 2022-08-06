import { settings } from "@/state/settings";
import Workspace from "./Workspace";
import AllFiles from "./files";
import Plugins from "./plugins";
import { Icon } from "solid-heroicons";
import { createDisclosure, Modal, ModalOverlay } from "@hope-ui/solid";
import { cog, collection, cube } from "solid-heroicons/outline";
import { Settings } from "@/pages";
import { createSignal, Show } from "solid-js";

export default function SidePanel() {
  const [showExtensionsPage, setShowExtensionsPage] = createSignal(false);

  const { isOpen, onOpen, onClose } = createDisclosure();
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

      <Show when={!showExtensionsPage()}>
        <div class="px-4 rounded-r-2xl h-12/12">
          <AllFiles />
        </div>
      </Show>
      <Show when={showExtensionsPage()}>
        <div class="px-4 rounded-r-2xl h-12/12">
          <Plugins />
        </div>
      </Show>

      <div class="absolute bottom-3 left-3">
        <div class="grid grid-cols-3 gap-3">
          <Icon
            path={collection}
            class="h-6 w-6 mr-auto hover:cursor-pointer"
            stroke-width={2}
            onClick={() => setShowExtensionsPage(false)}
          />
          <Icon
            path={cog}
            class="h-6 w-6 mr-auto hover:cursor-pointer"
            stroke-width={2}
            onClick={onOpen}
          />
          <Icon
            path={cube}
            class="h-6 w-6 mr-auto hover:cursor-pointer"
            stroke-width={2}
            onClick={() => setShowExtensionsPage(true)}
          />
          <Modal centered opened={isOpen()} onClose={onClose} size="7xl">
            <ModalOverlay
              bg="$blackAlpha3"
              css={{
                backdropFilter: "blur(10px) hue-rotate(90deg)",
              }}
            />
            <Settings onClose={onClose} />
          </Modal>
        </div>
      </div>
    </div>
  );
}
