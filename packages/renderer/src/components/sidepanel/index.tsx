import { settings } from "@/state/settings";
import AllFiles from "./files";
import Plugins from "./plugins";
import { Icon } from "solid-heroicons";
import { createDisclosure, Modal, ModalOverlay, Tooltip } from "@hope-ui/solid";
import {
  adjustmentsVertical,
  cog_6Tooth,
  cube,
  rectangleStack,
  sparkles,
} from "solid-heroicons/outline";
import { Settings } from "@/pages";
import { createSignal, For, Show } from "solid-js";
import {
  Select,
  SelectContent,
  SelectListbox,
  SelectTrigger,
} from "@hope-ui/solid";
import { togglePicker } from "@/state/app";
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
  const settingOptions = [
    <DropDownItem
      title="Theme"
      path={sparkles}
      onClick={() => togglePicker("themePickerShown")}
    />,
    <DropDownItem
      title="Settings"
      path={adjustmentsVertical}
      onClick={onOpen}
    />,
  ];

  return (
    <div class="mt-2 w-full">
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

      <div class="absolute bottom-3 left-3 justify-center">
        <div class="grid grid-cols-3 gap-3 items-center">
          <Tooltip label="Files">
            <Icon
              path={rectangleStack}
              class="h-6 w-6 mr-auto hover:cursor-pointer"
              style={settings.theme.sidePanelFg}
              stroke-width={2}
              onClick={() => setShowExtensionsPage(false)}
            />
          </Tooltip>
          <Select>
            <SelectTrigger>
              <Tooltip label="settings">
                <Icon
                  path={cog_6Tooth}
                  style={settings.theme.sidePanelFg}
                  color={settings.theme.sidePanelFg}
                  class="h-6 w-6 mr-auto hover:cursor-pointer"
                  stroke-width={2}
                />
              </Tooltip>
            </SelectTrigger>
            <SelectContent css={{ minWidth: "120px", borderRadius: "$xl" }}>
              <SelectListbox>
                <For each={settingOptions}>
                  {(item) => item}
                </For>
              </SelectListbox>
            </SelectContent>
          </Select>
          <Tooltip label="Plugins">
            <Icon
              path={cube}
              class="h-6 w-6 mr-auto hover:cursor-pointer"
              style={settings.theme.sidePanelFg}
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
