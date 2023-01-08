import { changeColorscheme, persistSettings, settings } from "@/state/settings";
import { ipcRenderer } from "electron";
import { Icon } from "solid-heroicons";
import { chevronLeft, chevronRight, moon, sun } from "solid-heroicons/outline";
import { createEffect, createSignal } from "solid-js";

export default function Titlebar() {
  const toggleTheme = async () => {
    await changeColorscheme(!settings.isLightTheme);
  };

  const openSidepanel = async () => {
    settings.sidepanelShown = !settings.sidepanelShown;
    await persistSettings();
  };

  const [fullscreen, setFullScreen] = createSignal(false);
  createEffect(() => {
    ipcRenderer.on("fullscreen", () => {
      setFullScreen(true);
    });
    ipcRenderer.on("leave-fullscreen", () => {
      setFullScreen(false);
    });
  });
  return (
    <div
      class={`w-screen z-20 bg-black py-3`}
      style={`-webkit-app-region: drag;${settings.theme.appFg}`}
    >
      <div class="grid items-center mr-3 gap-3 grid-cols-2 w-full">
        <div class={!fullscreen() ? "ml-20" : "ml-3"}>
          <Icon
            path={settings.sidepanelShown ? chevronLeft : chevronRight}
            class="text-white h-5 hover:cursor-pointer"
            onClick={openSidepanel}
          />
        </div>
        <div class="flex justify-end mr-5 gap-4">
          <button
            class="hover:cursor-pointer"
            onClick={toggleTheme}
          >
            {settings.isLightTheme
              ? <Icon path={moon} class="h-4 w-4 text-white" stroke-width={2} />
              : <Icon path={sun} class="h-4 w-4" stroke-width={2} />}
          </button>

          <img
            src={settings.pfpPath
              ? `atom://${settings.pfpPath}`
              : "https://www.mintface.xyz/content/images/2021/08/QmdhoQdQ1oB2rdJD3ZpexSwwfspqAWGMdDjPR3mYeWGpZT.png"}
            class="w-6 h-6 rounded-lg shadow-stone-2xl hover:(cursor-pointer)"
            style={settings.theme.appBg}
            // onClick={() => fileRef.click()}
          />
        </div>
      </div>

      <div>
      </div>
    </div>
  );
}
