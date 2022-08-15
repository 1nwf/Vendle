import { plugins } from "@/state/settings";
import { initPlugins } from "@/util/plugins";
import { Spinner } from "@hope-ui/solid";
import { useNavigate, useParams } from "@solidjs/router";
import { ipcRenderer } from "electron";
import { Plugin } from "packages/types/plugins";
import { createResource, createSignal, Show } from "solid-js";

export default function Plugins() {
  const fetchPluginData = async (name: string) => {
    const p = plugins.find((p) => p.name === name) ?? null;
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
          name: data.name,
          displayName: data.vendle.name,
          description: data.vendle.description,
          version: data.version,
          author: data.author.name,
          type: data.vendle.type,
          icon: data.vendle.icon,
        };

        setPlugin(plugin);
      });
    setReadme("");
  };
  const params = useParams();
  const [plugin, setPlugin] = createSignal<Partial<Plugin>>();
  const [installed, setInstalled] = createSignal(false);
  createResource(() => params.name, fetchPluginData);
  const [readme, setReadme] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const installPlugin = async () => {
    if (loading()) return;
    const p = plugin();
    if (!p) return;
    setLoading(true);
    await ipcRenderer.invoke("installPlugin", p.name);
    setLoading(false);

    setInstalled(true);
    initPlugins();
  };
  const navigate = useNavigate();

  const uninstallPlugin = async () => {
    if (loading()) return;
    if (confirm(`uninstall ${plugin()?.name}?`)) {
      setLoading(true);
      await ipcRenderer.invoke("uninstallPlugin", plugin()?.name).then(() => {
        setLoading(false);
        setInstalled(false);
        plugins.splice(
          plugins.findIndex((p) => p.name === plugin()?.name),
          1
        );
      });
    }
  };
  return (
    <div class="px-10 mt-5">
      <Show when={plugin()}>
        <div class="flex items-center">
          {plugin().icon && (
            <img src={"atom://" + plugin().icon} class="h-20 w-20 rounded-md" />
          )}
          <div class="block ml-5">
            <div class="flex items-baseline">
              <h1>{plugin()?.displayName}</h1>
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
                {loading() ? (
                  <div class="p-1">
                    <Spinner size="xs" />
                  </div>
                ) : (
                  "uninstall"
                )}
              </button>
            ) : (
              <button
                class="bg-blue-500 text-white p-1 rounded-md text-xs"
                onClick={async () => await installPlugin()}
              >
                {loading() ? (
                  <div class="p-1">
                    <Spinner size="xs" />
                  </div>
                ) : (
                  "install"
                )}
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
