import { mkdirSync, writeFileSync, promises as fs } from "fs";
import {
  NOTES_PATH,
  PLUGINS_PATH,
  SETTINGS_PATH,
  WORKSPACE_FILES,
} from "./constants";

export const initDirs = () => {
  mkdirSync(NOTES_PATH);
  mkdirSync(PLUGINS_PATH);
  writeFileSync(SETTINGS_PATH, JSON.stringify({ name: "No User Name" }));
  writeFileSync(WORKSPACE_FILES, "[]");
};

export const saveFile = async (id: string, contents: any) => {
  await fs.writeFile(NOTES_PATH + `${id}.json`, JSON.stringify(contents));
};

export const deleteNote = async (id: string) => {
  await fs.unlink(NOTES_PATH + `${id}.json`);
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
  return JSON.parse(res);
};
