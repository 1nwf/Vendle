import { promises as fs, rmSync } from "fs";
import { Plugin } from "../types/plugins";
import { PLUGINS_PATH, yarn } from "./constants";
import showdown from "showdown";
import { execFile } from "child_process";
import path from "path";
import fsx from "fs-extra";

export const getPluginPaths = async () => {
  let paths: string[] = [];
  let plugins = await fs.readdir(PLUGINS_PATH);
  plugins.forEach((dir) => {
    if (dir.startsWith(".") || dir === "package.json") return;
    paths.push(PLUGINS_PATH + dir);
  });
  return paths;
};

export const getPluginInfo = async (
  dir: string
): Promise<Omit<Plugin, "path" | "module">> => {
  let files = await fs.readdir(dir);
  if (!files.includes("package.json")) {
    throw new Error("plugin does not contain package.json");
  }
  let info = JSON.parse(await fs.readFile(dir + "/package.json", "utf8"));
  let { vendle } = info;

  return {
    name: info.name,
    displayName: vendle.name,
    description: vendle.description,
    version: info.version,
    icon: vendle.icon,
    type: vendle.type,
    author: vendle.author,
  };
};

export const getPluginReadme = async (name: string) => {
  const readmePath = PLUGINS_PATH + name + "/README.md";
  const contents = await fs.readFile(readmePath, "ascii").catch((e) => "");
  const converter = new showdown.Converter();
  return converter.makeHtml(contents);
};

export const uninstallPlugin = async (name: string) => {
  return await fs.rmdir(PLUGINS_PATH + name, { recursive: true });
};

const installPlugin = async (name: string) => {
  return new Promise<string>(async (resolve, reject) => {
    const dir = PLUGINS_PATH + `${name}-${Date.now()}`;
    await fs.mkdir(dir, { recursive: true });
    execFile(
      process.execPath,
      [
        "--no-deprecation",
        yarn,
        "add",
        name,
        "--modules-folder",
        dir,
        "--cwd",
        dir,
        "--no-lockfile",
        "--production",
        "--no-progress",
      ],
      {
        cwd: dir,
        maxBuffer: 1024 * 1024,
        env: {
          NODE_ENV: "production",
          ELECTRON_RUN_AS_NODE: "true",
          VITE_DEV_SERVER_HOST: "localhost",
          VITE_DEV_SERVER_PORT: "3344",
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          console.error("err:", err);
          return;
        }
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
        console.log("done");
        resolve(dir);
      }
    );
  });
};

export const install = async (name: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const plugin = await isValidPlugin(name);
      const pluginDir = path.join(PLUGINS_PATH, name);
      await fs.mkdir(pluginDir);
      await fs.mkdir(path.join(pluginDir, "node_modules"));
      const tempDir = await installPlugin(name);
      fsx.moveSync(path.join(tempDir, name), pluginDir, {
        overwrite: true,
      });

      const pluginFiles = await fs.readdir(pluginDir);
      if (pluginFiles.includes("package.json")) {
        const pjson = JSON.parse(
          await fs.readFile(pluginDir + "/package.json", "utf8")
        );
        if (pjson.dependencies) {
          await movePluginDeps(
            tempDir,
            pluginDir,
            Object.keys(pjson.dependencies)
          );
        }
        if (pjson.devDependencies) {
          await movePluginDeps(
            tempDir,
            pluginDir,
            Object.keys(pjson.devDependencies)
          );
        }
        rmSync(tempDir, { recursive: true, force: true });
        resolve(plugin);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const movePluginDeps = async (src: string, dist: string, deps: string[]) => {
  await Promise.all(
    deps.map(async (dep) => {
      path.join(dist, "node_modules", dep);
      await fsx.move(
        path.join(src, dep),
        path.join(dist, "node_modules", dep),
        {
          overwrite: true,
        }
      );
    })
  );
};

const isValidPlugin = async (name: string) => {
  return new Promise<Plugin>((resolve, reject) => {
    execFile(
      process.execPath,
      [yarn, "info", name, "--json"],
      {
        maxBuffer: 1024 * 1024,
        env: {
          NODE_ENV: "production",
          ELECTRON_RUN_AS_NODE: "true",
          VITE_DEV_SERVER_HOST: "localhost",
          VITE_DEV_SERVER_PORT: "3344",
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
          return;
        }

        const { data } = JSON.parse(stdout.toString());

        if (!data.hasOwnProperty("vendle")) {
          reject(new Error("plugin is not a vendle plugin"));
          return;
        }
        resolve({
          name: data.name,
          displayName: data.vendle.name,
          version: data.vendle.version,
          author: data.vendle.author,
          description: data.vendle.description,
          icon: data.vendle.icon,
          type: data.vendle.type,
          module: {},
        });
      }
    );
  });
};
