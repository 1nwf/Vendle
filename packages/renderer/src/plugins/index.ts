import { plugins } from "../state/settings";
import { PluginApi, pluginApis } from "../../../types/plugins";

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
  loadedPlugins.forEach((plugin) => {
    Object.keys(plugin.module).forEach((mod) => {
      let m = mod as PluginApi;
      plugins[m].push(plugin.module[m]);
    });
  });
  console.log("plugins", loadedPlugins);
};
