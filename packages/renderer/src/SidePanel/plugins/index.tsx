import { loadPlugins } from "@/plugins";
import { createEffect, createSignal, For } from "solid-js";
import { Plugin } from "../../../../types/plugins";

export default function Plugins() {
  const [plugins, setPlugins] = createSignal<Plugin[]>([]);
  createEffect(async () => {
    const p = await loadPlugins();
    setPlugins(p);
  });
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
            <div class="p-2 text-sm w-full rounded mt-1 hover:(bg-black bg-opacity-20 cursor-pointer)">
              <p>{p.name}</p>
              <p class="text-gray-600 text-xs">{p.description}</p>
            </div>
          );
        }}
      </For>
    </div>
  );
}
