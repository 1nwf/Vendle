import { plugins } from "@/state/settings";
import { matchSorter } from "match-sorter";
import { createSignal, For } from "solid-js";
import PluginCard from "./plugin";

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
          return <PluginCard plugin={p} />;
        }}
      </For>
    </div>
  );
}
