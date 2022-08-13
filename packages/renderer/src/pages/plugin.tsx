import { plugins } from "@/state/settings";
import { initPlugins } from "@/util/plugins";
import { useNavigate, useParams } from "@solidjs/router";
import { ipcRenderer } from "electron";
import { Plugin } from "packages/types/plugins";
import { createResource, createSignal, Show } from "solid-js";

export default function Plugins() {
  const fetchReadMe = async (name: string) => {
    const pluginName = name.includes("vendle-plugin")
      ? name.substring(14)
      : name;
    const p = plugins.find((p) => p.name === pluginName) ?? null;
    if (p) {
      const readme = await ipcRenderer.invoke("getPluginReadme", name);
      setPlugin(p);
      setReadme(readme ?? "");
      setInstalled(true);
      return;
    }
    setInstalled(false);
    await fetch(`https://registry.npmjs.org/${name}/latest`)
      .then((r) => r.json())
      .then((data) => {
        const plugin = {
          name: data.vendle.name,
          description: data.vendle.description,
          version: data.version,
          author: data.author.name,
          type: data.vendle.type,
          icon: "",
        };
        setPlugin(plugin);
      });
  };
  const params = useParams();
  const [plugin, setPlugin] = createSignal<Partial<Plugin>>();
  const [installed, setInstalled] = createSignal(false);
  createResource(() => params.name, fetchReadMe);
  const [readme, setReadme] = createSignal("");
  const installPlugin = async () => {
    const p = plugin();
    if (!p) return;
    await ipcRenderer.invoke("installPlugin", "vendle-plugin-" + p.name);
    setInstalled(true);
    initPlugins();
  };
  const navigate = useNavigate();

  const uninstallPlugin = async () => {
    if (confirm(`uninstall ${plugin()?.name}?`)) {
      await ipcRenderer
        .invoke("uninstallPlugin", "vendle-plugin-" + plugin()?.name)
        .then(() => {
          plugins.splice(
            plugins.findIndex((p) => p.name === plugin()?.name),
            1
          );
        });
      navigate("/");
    }
  };
  return (
    <div class="px-10 mt-5">
      <Show when={plugin()}>
        <div class="flex items-center">
          {plugin().icon && (
            <img src={plugin().icon} class="h-20 w-20 rounded-md" />
          )}
          <div class="block ml-5">
            <div class="flex items-baseline">
              <h1>{plugin().name}</h1>
              <p class="bg-black p-1 rounded-md text-[10px] ml-2 text-white">
                {plugin().version}
              </p>
            </div>
            <p>{plugin().description}</p>
            <p class="text-gray-500 text-sm">by: {plugin().author}</p>

            {installed() ? (
              <button
                class="bg-red-500 text-white p-1 rounded-md text-xs"
                onClick={async () => await uninstallPlugin()}
              >
                delete
              </button>
            ) : (
              <button
                class="bg-blue-500 text-white p-1 rounded-md text-xs"
                onClick={async () => await installPlugin()}
              >
                install
              </button>
            )}
          </div>
        </div>
      </Show>
      <hr class="mt-5" />
      <div innerHTML={readme()} class="mt-5" />
    </div>
  );
}
