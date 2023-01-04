import { app } from "electron";
import { mkdirSync, promises as fs, writeFileSync } from "fs";
import {
  NOTES_PATH,
  PLUGINS_PATH,
  SETTINGS_PATH,
  WORKSPACE_FILES,
} from "./constants";

import { join } from "path";
export const initDirs = () => {
  mkdirSync(NOTES_PATH);
  mkdirSync(PLUGINS_PATH);
  writeFileSync(SETTINGS_PATH, JSON.stringify({ name: "No User Name" }));
  writeFileSync(WORKSPACE_FILES, "[]");
};

export const saveFile = async (id: string, contents: string) => {
  if (id == "files") {
    return await fs.writeFile(WORKSPACE_FILES, contents);
  } else if (id == "settings") {
    return await fs.writeFile(SETTINGS_PATH, contents);
  }
  return await fs.writeFile(NOTES_PATH + `${id}.json`, contents);
};

export const deleteNote = async (id: string) => {
  await fs.unlink(NOTES_PATH + `${id}.json`).catch(() => {
    throw new Error("could not delete note");
  });
};

export const getFileContents = async (name: string) => {
  let res: string;
  if (name == "settings") {
    res = await fs.readFile(SETTINGS_PATH, "utf8");
  } else if (name == "files") {
    res = await fs.readFile(WORKSPACE_FILES, "utf8");
  } else {
    res = await fs.readFile(NOTES_PATH + `${name}.json`, "utf8");
  }

  return res;
};
export const updateUserPfp = async (path: string) => {
  let ext = path.split(".").pop();
  const userData = app.getPath("userData");
  let pfpPath = (await fs.readdir(userData)).find((p) => p.includes("pfp"));

  if (pfpPath && pfpPath.split(".").pop() != ext) {
    await fs.rename(join(userData, pfpPath), join(userData, `pfp.${ext}`));
  } else {
    await fs.writeFile(join(userData, `pfp.${ext}`), "");
  }
  await fs.copyFile(path, `${userData}/pfp.${ext}`);
  return join(userData, `pfp.${ext}`);
};

export const saveFileSync = (id: string, contents: string) => {
  if (id == "files") {
    return writeFileSync(WORKSPACE_FILES, contents);
  } else if (id == "settings") {
    return writeFileSync(SETTINGS_PATH, contents);
  }
  return writeFileSync(NOTES_PATH + `${id}.json`, contents);
};
