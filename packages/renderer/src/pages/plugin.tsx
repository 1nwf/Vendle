import { plugins } from "@/state/settings";
import { useParams } from "@solidjs/router";
import { ipcRenderer } from "electron";
import { Plugin } from "packages/types/plugins";
import { createResource, createSignal, Show } from "solid-js";

export default function Plugins() {
  const fetchReadMe = async (name: string) => {
    const readme = await ipcRenderer.invoke("getPluginReadme", name);
    setReadme(readme ?? "");
    setPlugin(plugins.find((p) => p.name === name) ?? null);
  };
  const params = useParams();
  const [plugin, setPlugin] = createSignal<Plugin | null>();
  createResource(() => params.name, fetchReadMe);
  const [readme, setReadme] = createSignal("");

  const uninstallPlugin = async () => {
    if (confirm(`uninstall ${plugin()?.name}?`)) {
      await ipcRenderer.invoke("uninstallPlugin", plugin()?.name).then(() => {
        plugins.splice(
          plugins.findIndex((p) => p.name === plugin()?.name),
          1
        );
      });
      setPlugin(null);
    }
  };
  return (
    <div class="px-10 mt-5">
      <Show when={plugin()}>
        <div class="flex items-center">
          <img src={plugin().icon} class="h-20 w-20 rounded-md" />
          <div class="block ml-5">
            <h1>{plugin().name}</h1>
            <p>{plugin().description}</p>
            <p class="text-gray-500 text-sm">by: {plugin().author}</p>
            <button
              class="bg-red-500 text-white p-1 rounded-md text-xs"
              onClick={async () => await uninstallPlugin()}
            >
              delete
            </button>
          </div>
        </div>
      </Show>
      <hr class="mt-5" />
      <div innerHTML={readme()} class="mt-5" />
    </div>
  );
}
