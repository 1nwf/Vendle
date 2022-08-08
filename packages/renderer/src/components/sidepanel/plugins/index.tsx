import { plugins } from "@/state/settings";
import { matchSorter } from "match-sorter";
import { createSignal, For } from "solid-js";

export default function Plugins() {
  const [pluginsList, setPluginsList] = createSignal(plugins);
  const handleOnInput = (e: any) => {
    setPluginsList(
      matchSorter(plugins, e.target.value, {
        keys: ["name", "type", "description"],
      })
    );
  };
  return (
    <div>
      <h1>Plugins</h1>
      <input
        class="p-2 text-sm w-full rounded my-2 text-black"
        type="text"
        placeholder="Search Plugins"
        onInput={handleOnInput}
      />
      <For each={pluginsList()}>
        {(p) => {
          return (
            <div class="p-2 text-sm w-full rounded mt-1 hover:(bg-black bg-opacity-20 cursor-pointer)">
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
