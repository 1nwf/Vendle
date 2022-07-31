import { loadPlugins, loadStyles } from "@/util/plugins";
import { createEffect, createSignal, For } from "solid-js";
import { Plugin } from "../../../../../types/plugins";

export default function Plugins() {
  const [plugins, setPlugins] = createSignal<Plugin[]>([]);
  createEffect(async () => {
    const p = await loadPlugins();
    setPlugins(p);
  });
  const handleSwitchColorscheme = (colors) => {
    loadStyles(colors);
  };
  return (
    <div>
      <h1>Plugins</h1>
      <input
        class="p-2 text-sm w-full rounded my-2 text-black"
        type="text"
        placeholder="Search Plugins"
      />
      <For each={plugins()}>
        {(p) => {
          return (
            <div
              class="p-2 text-sm w-full rounded mt-1 hover:(bg-black bg-opacity-20 cursor-pointer)"
              onClick={() => handleSwitchColorscheme(p.module.setColorscheme())}
            >
              <div class="flex flex-row items-center">
                <p class="">{p.name}</p>
                <p class="text-gray-500 text-xs ml-auto">{p.type}</p>
              </div>
              <p class="text-gray-600 text-xs">{p.description}</p>
            </div>
          );
        }}
      </For>
    </div>
  );
}
