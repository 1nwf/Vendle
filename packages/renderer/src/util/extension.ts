import { BaseDirectory, readDir } from "@tauri-apps/api/fs";
import { plugins, ExtApi } from "../state/settings";

export const loadExtensions = async () => {
  let pluginsPaths = await readDir("Vendle/extensions", {
    dir: BaseDirectory.Data,
  });
  pluginsPaths = pluginsPaths.filter((p) => p.path.endsWith("js"));
  console.log("plugin paths:", pluginsPaths);

  pluginsPaths.forEach(async (p) => {
    await import(p.path)
      .then((res) => {
        Object.keys(plugins).forEach((key: ExtApi) => {
          if (Object.keys(res).includes(key)) {
            plugins[key].push(res[key]);
          }
        });
      })
      .catch((e) => {
        console.log("loading plugins error: ", e);
      });
  });
};

export const downloadExtension = async (name: string) => {
  // TODO: download extensions from npm
};
