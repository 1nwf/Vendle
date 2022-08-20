import { findPlugin } from "@/state/settings";
import { ipcRenderer } from "electron";
import { createResource } from "solid-js";

export default function PluginData({ params }) {
  const [plugin] = createResource(
    () => ({
      name: params.name,
      type: params.type as "editor" | "colorscheme" | undefined,
    }),
    async ({ name, type }) => {
      const p = findPlugin(name, type);

      if (p) {
        const readme = await ipcRenderer.invoke("getPluginReadme", name);

        return {
          plugin: p,
          readme: readme ?? "",
          isInstalled: true,
        };
      }

      return await fetch(`https://registry.npmjs.org/${name}/latest`)
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

          return {
            plugin,
            readme: "",
            isInstalled: false,
          };
        });
    }
  );
  return plugin;
}
