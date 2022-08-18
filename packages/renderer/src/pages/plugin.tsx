import { findPlugin, plugins } from "@/state/settings";
import { initPlugins } from "@/util/plugins";
import { Spinner } from "@hope-ui/solid";
import { useParams } from "@solidjs/router";
import { ipcRenderer } from "electron";
import { Plugin } from "packages/types/plugins";
import { createResource, createSignal, Show } from "solid-js";

export default function Plugins() {
  const fetchPluginData = async ({
    name,
    type,
  }: {
    name: string;
    type: "editor" | "colorscheme" | undefined;
  }) => {
    const p = findPlugin(name, type);
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
  createResource(
    () => ({ name: params.name, type: params.type }),
    fetchPluginData
  );
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

  const uninstallPlugin = async () => {
    if (loading()) return;
    if (confirm(`uninstall ${plugin()?.displayName}?`)) {
      setLoading(true);
      await ipcRenderer.invoke("uninstallPlugin", plugin()?.name).then(() => {
        setLoading(false);
        setInstalled(false);
        plugins[plugin().type].splice(
          plugins[plugin().type].findIndex((p) => p.name === plugin()?.name),
          1
        );
      });
    }
  };
  const [updating, setUpdating] = createSignal(false);
  const updatePlugin = async () => {
    setUpdating(true);
    await ipcRenderer.invoke("updatePlugin", plugin()!.name);
    setUpdating(false);
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
              <div>
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

                <Show when={plugin()?.updateAvailable}>
                  <button
                    class="p-1 text-xs mx-2 bg-blue-500 text-white rounded-md"
                    onClick={async () => await updatePlugin()}
                  >
                    {updating() ? (
                      <div>
                        <Spinner size="xs" />
                      </div>
                    ) : (
                      "upgrade"
                    )}
                  </button>
                </Show>
              </div>
            ) : (
              <button
                class="bg-black text-white p-1 rounded-md text-xs"
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
