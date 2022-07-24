import { plugins } from "../state/settings";
import { PluginApi, PluginApis } from "../../../types/plugins";

export const loadPlugins = async () => {
  let paths = await window.getPluginPaths();
  let plugins = await Promise.all(
    window
      .loadPlugins(paths)
      .map(async (d) => ({ ...d, ...(await window.getPluginInfo(d.path)) }))
  );
  return plugins;
};

export const initPlugins = async () => {
  const loadedPlugins = await loadPlugins();
  console.log("loadedPlugins", loadedPlugins);

  loadedPlugins.forEach((plugin) => {
    Object.keys(plugin.module).forEach((mod) => {
      let m = mod as PluginApi;
      if (PluginApis.includes(m)) {
        plugins[m].push(plugin.module[m]);
      }
    });
  });
};
