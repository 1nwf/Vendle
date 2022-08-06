import { changeColorscheme, settings } from "@/state/settings";
import { Icon } from "solid-heroicons";
import { moon, sun } from "solid-heroicons/outline";

export default function Titlebar() {
  const toggleTheme = () => {
    changeColorscheme(!settings.isLightTheme);
  };
  return (
    <div
      class={`w-screen bg-transparent absolute pb-2 z-20 `}
      style={`-webkit-app-region: drag;${settings.theme.appFg}`}
    >
      <div class="flex content-center items-center align-middle mt-1 ml-3">
        <div class="ml-18 pt-1 text-sm">TitleBar</div>
        <button
          class="ml-4 pt-1 text-sm hover:cursor-pointer"
          onClick={toggleTheme}
        >
          {settings.isLightTheme ? (
            <Icon path={moon} class="h-4 w-4" stroke-width={2} />
          ) : (
            <Icon path={sun} class="h-4 w-4" stroke-width={2} />
          )}
        </button>
      </div>
    </div>
  );
}
