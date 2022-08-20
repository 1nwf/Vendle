import { plugins } from "@/state/settings";
import { initPlugins } from "@/util/plugins";
import { Spinner } from "@hope-ui/solid";
import { useRouteData } from "@solidjs/router";
import { ipcRenderer } from "electron";
import { createEffect, createSignal, Show } from "solid-js";

export default function Plugins() {
  const data = useRouteData();
  const [installed, setInstalled] = createSignal(false);

  createEffect(() => {
    if (!data()) return;
    setInstalled(data().isInstalled);
  });
  const [loading, setLoading] = createSignal(false);

  const installPlugin = async () => {
    if (loading()) return;
    const plugin = data().plugin;
    if (!plugin) return;
    setLoading(true);
    await ipcRenderer.invoke("installPlugin", plugin.name);
    setLoading(false);

    setInstalled(true);
    initPlugins();
  };

  const uninstallPlugin = async () => {
    const plugin = data().plugin;
    if (loading()) return;
    if (confirm(`uninstall ${plugin.displayName}?`)) {
      setLoading(true);
      await ipcRenderer.invoke("uninstallPlugin", plugin.name).then(() => {
        setLoading(false);
        setInstalled(false);
        plugins[plugin.type].splice(
          plugins[plugin.type].findIndex((p) => p.name === plugin.name),
          1
        );
      });
    }
  };
  const [updating, setUpdating] = createSignal(false);
  const updatePlugin = async () => {
    setUpdating(true);
    await ipcRenderer.invoke("updatePlugin", data().plugin.name);
    setUpdating(false);
  };
  return (
    <Show when={data()}>
      <div class="px-10 mt-5">
        <div class="flex items-center">
          {data().plugin.icon && (
            <img
              src={"atom://" + data().plugin.icon}
              class="h-20 w-20 rounded-md"
            />
          )}
          <div class="block ml-5">
            <div class="flex items-baseline">
              <h1>{data().plugin.displayName}</h1>
              <p class="bg-black p-1 rounded-md text-[10px] ml-2 text-white">
                {data().plugin.version}
              </p>
            </div>
            <p>{data().plugin.description}</p>
            <p class="text-gray-500 text-sm">by: {data().plugin.author}</p>

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

                <Show when={data().plugin.updateAvailable}>
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
        <hr class="mt-5" />
        <div innerHTML={data().readme} class="mt-5" />
      </div>
    </Show>
  );
}
