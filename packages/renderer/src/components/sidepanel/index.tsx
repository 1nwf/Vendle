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
import { createEffect, createSignal, For, Show } from "solid-js";
import {
  Select,
  SelectContent,
  SelectListbox,
  SelectTrigger,
} from "@hope-ui/solid";
import { togglePicker } from "@/state/app";
import useResize from "@/hooks/useResize";
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

  const [sidebarWidth, setSidbarWidth] = createSignal(0);
  let resizeRef: any;
  createEffect(() => {
    const w = useResize(resizeRef);
    createEffect(() => {
      if (w() != 0 && w() > 200) {
        setSidbarWidth(w());
      }
    });
  });
  return (
    <div
      class="float-left h-full md:(w-3/12) w-2/5 lg:(w-1/5) z-50 max-w-[350px]"
      style={`${settings.theme.sidePanelBg}; ${
        sidebarWidth() && `width: ${sidebarWidth()}px;`
      };${settings.theme.sidePanelFg}`}
    >
      <div
        class="w-1 z-50 float-right h-full z-50 active:(bg-gray-300) hover:(bg-gray-300 cursor-move)"
        ref={resizeRef}
      >
      </div>
      <div class="">
        <div class="grid grid-rows-3 items-center mx-3 border-b-1 border-gray-300 mb-3 pb-2">
          <div
            class="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => setShowExtensionsPage(false)}
          >
            <Icon
              path={rectangleStack}
              class="h-5  "
              style={settings.theme.sidePanelFg}
              stroke-width={2}
            />
            <p class="text-sm">files</p>
          </div>
          <Select>
            <SelectTrigger>
              <div class="flex items-center gap-2 hover:cursor-pointer">
                <Icon
                  path={cog_6Tooth}
                  style={settings.theme.sidePanelFg}
                  color={settings.theme.sidePanelFg}
                  class="h-5"
                  stroke-width={2}
                />
                <p class="text-sm">settings</p>
              </div>
            </SelectTrigger>
            <SelectContent css={{ minWidth: "120px", borderRadius: "$xl" }}>
              <SelectListbox>
                <For each={settingOptions}>
                  {(item) => item}
                </For>
              </SelectListbox>
            </SelectContent>
          </Select>
          <div
            class="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => setShowExtensionsPage(true)}
          >
            <Icon
              path={cube}
              class="h-5"
              style={settings.theme.sidePanelFg}
              stroke-width={2}
            />
            <p class="text-sm">plugins</p>
          </div>
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
    </div>
  );
}
