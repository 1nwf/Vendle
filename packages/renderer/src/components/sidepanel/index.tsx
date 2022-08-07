import { settings } from "@/state/settings";
import Workspace from "./Workspace";
import AllFiles from "./files";
import Plugins from "./plugins";
import { Icon } from "solid-heroicons";
import { createDisclosure, Modal, ModalOverlay, Tooltip } from "@hope-ui/solid";
import {
  adjustments,
  cog,
  collection,
  cube,
  sparkles,
} from "solid-heroicons/outline";
import { Settings } from "@/pages";
import { createSignal, For, Show } from "solid-js";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectListbox,
} from "@hope-ui/solid";
import ThemeSelector from "../plugins/theme/ThemeSelector";
const DropDownItem = ({
  title,
  path,
  onClick,
}: {
  title: string;
  path: typeof cube;
  onClick: () => void;
}) => {
  return (
    <div
      class="flex items-center hover:(bg-gray-200 cursor-pointer) p-2 rounded-lg text-sm"
      onClick={onClick}
    >
      <Icon path={path} stroke-width={2} class="h-4 w-4 mr-2" />
      {title}
    </div>
  );
};

export default function SidePanel() {
  const [showExtensionsPage, setShowExtensionsPage] = createSignal(false);
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [showThemeSelector, setShowThemeSelector] = createSignal(false);
  const settingOptions = [
    <DropDownItem
      title="Theme"
      path={sparkles}
      onClick={() => {
        setShowThemeSelector(true);
      }}
    />,
    <DropDownItem title="Settings" path={adjustments} onClick={onOpen} />,
  ];

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
      <Show when={showThemeSelector()}>
        <ThemeSelector closeHandler={() => setShowThemeSelector(false)} />
      </Show>

      <div class="absolute bottom-3 left-3">
        <div class="grid grid-cols-3 gap-3 items-center">
          <Tooltip label="Files">
            <Icon
              path={collection}
              class="h-6 w-6 mr-auto hover:cursor-pointer"
              stroke-width={2}
              onClick={() => setShowExtensionsPage(false)}
            />
          </Tooltip>
          <Select variant="unstyled">
            <SelectTrigger style={settings.theme.appFg} transition="none">
              <Tooltip label="settings">
                <Icon
                  path={cog}
                  class="h-6 w-6 mr-auto hover:cursor-pointer"
                  stroke-width={2}
                />
              </Tooltip>
            </SelectTrigger>
            <SelectContent css={{ minWidth: "120px", borderRadius: "$xl" }}>
              <SelectListbox>
                <For each={settingOptions}>{(item) => item}</For>
              </SelectListbox>
            </SelectContent>
          </Select>
          <Tooltip label="Plugins">
            <Icon
              path={cube}
              class="h-6 w-6 mr-auto hover:cursor-pointer"
              stroke-width={2}
              onClick={() => setShowExtensionsPage(true)}
            />
          </Tooltip>
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
