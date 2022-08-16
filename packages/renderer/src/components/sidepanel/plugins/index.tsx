import { plugins } from "@/state/settings";
import { matchSorter } from "match-sorter";
import { createSignal, For, Show } from "solid-js";
import PluginCard from "./PluginCard";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectListbox,
} from "@hope-ui/solid";

export default function Plugins() {
  const [pluginsList, setPluginsList] = createSignal(plugins);
  const [searchPlugin, setSearchPlugin] = createSignal("");
  const [filters, setFilters] = createSignal<string[]>([]);
  const handleOnInput = async (e: any) => {
    setSearchPlugin(e.target.value);
    if (filters().includes("installed")) {
      setPluginsList(
        matchSorter(plugins, e.target.value, {
          keys: ["name", "type", "description"],
        })
      );
    } else {
      await search();
    }
  };
  const updateFilters = (f: string) => {
    if (filters().includes(f)) return;
    setPluginsList(plugins);
    setFilters((prev) => [...prev, f]);
  };
  const clearFilter = (f: string) => {
    setFilters((prev) => prev.filter((p) => p !== f));
  };
  const search = async () => {
    let url = `https://registry.npmjs.org/-/v1/search?text=vendle-plugin-${searchPlugin().replace(
      " ",
      "-"
    )}`;
    return await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let d = data.objects.map((p: any) => {
          return {
            name: p.package.name,
            displayName: p.package.name.substring(14).replace("-", " "),
            author: p.package.author.name,
            description: p.package.description || "",
            icon: "",
          };
        });

        setPluginsList(d);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Plugins</h1>
      <div class="flex items-center">
        <input
          class="p-2 text-sm w-full rounded-md my-2 text-black"
          type="text"
          placeholder="Search Plugins"
          onInput={async (e) => await handleOnInput(e)}
        />
        <div class="m-2">
          <Select>
            <SelectTrigger>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 ml-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width={2}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </SelectTrigger>
            <SelectContent css={{ minWidth: "120px", borderRadius: "$lg" }}>
              <SelectListbox>
                <div
                  class="w-full p-2 text-xs rounded-md hover:(bg-gray-200 cursor-pointer)"
                  onClick={() => updateFilters("installed")}
                >
                  Installed
                </div>
              </SelectListbox>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Show when={filters()}>
        <div class="flex">
          <For each={filters()}>
            {(f) => {
              return (
                <div
                  class="bg-gray-700 bg-opacity-60 text-white rounded-md px-2 py-1 hover:(bg-opacity-100 cursor-pointer)"
                  onClick={() => clearFilter(f)}
                >
                  <p class="text-xs">{f}</p>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
      <For each={pluginsList()}>
        {(p) => {
          return <PluginCard plugin={p} />;
        }}
      </For>
    </div>
  );
}
