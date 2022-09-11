import {
  allFiles,
  file,
  resetFileState,
  setAllFiles,
  setFile,
} from "../state/file";
import { store } from "@/store";
import { ipcRenderer } from "electron";
import { editor } from "@/state/editor";

export const handleFileSave = async (id: string, contents: string) => {
  return await ipcRenderer.invoke("saveFile", id, contents);
};
export const deleteNote = async (id: string) => {
  ipcRenderer.invoke("deleteNote", id);
};
export const handleFileGetContents = async (name: string) => {
  return await ipcRenderer.invoke("getFileContents", name);
};

export const WORKSPACE_FILES = "files";
const setWorkspaceFiles = (files: any[]) => {
  setAllFiles(() => [...files]);
};

export async function saveFile(id: string, name: string, contents: any) {
  await handleFileSave(id, JSON.stringify(contents));
  if (![WORKSPACE_FILES, "user"].includes(id)) {
    await updateWorkspaceFiles(id, name);
  }
}

export async function getFileContents<T>(name: string): Promise<T> {
  let contents = await handleFileGetContents(name);
  return JSON.parse(contents);
}

async function updateWorkspaceFiles(id: string, name: string) {
  let currentFiles = allFiles();
  let fileIdx = currentFiles.findIndex((f) => f.id == id);
  if (fileIdx != -1) {
    currentFiles[fileIdx] = { ...currentFiles[fileIdx], updatedAt: new Date() };
    currentFiles.sort((a, b) => a.index - b.index);
  } else {
    currentFiles.push({
      id: id,
      name: name,
      createdAt: new Date(),
      updatedAt: new Date(),
      index: currentFiles.length,
    });
  }
  setWorkspaceFiles(currentFiles);
  await store.set(WORKSPACE_FILES, currentFiles);
}

export async function deleteFile(id: string) {
  let currentFiles = allFiles();
  let idx = currentFiles.findIndex((f) => f.id === id);
  if (idx != currentFiles.length - 1) {
    currentFiles[idx + 1].index = currentFiles[idx].index;
  }
  currentFiles.splice(idx, 1);
  await deleteNote(id);
  await store.set(WORKSPACE_FILES, currentFiles);
  setWorkspaceFiles(currentFiles);
  resetFileState();
}

export async function renameFile(id: string, oldName: string, newName: string) {
  await updateFileTitle(id, oldName, newName);
  let updatedFiles = allFiles();
  let idx = updatedFiles.findIndex((f) => f.id == id);
  updatedFiles[idx].name = newName;
  await store.set(WORKSPACE_FILES, updatedFiles);
  setWorkspaceFiles(updatedFiles);
}

export async function saveNote() {
  if (!file.id) return;
  await saveFile(file.id, file.name, editor()!.getJSON());
}
const updateFileTitle = async (id: string, name: string, title: string) => {
  if (file.id === id) {
    const contents = editor()!.getJSON();
    const titlePos = contents.content![0];

    if (Object.prototype.hasOwnProperty.call(titlePos, 'content')) {
      titlePos.content![0].text = title;
    } else {
      titlePos.content = [{ text: title, type: "text" }];
    }

    setFile("contents", contents);
  } else {
    const contents = await getFileContents<any>(id);
    contents.content[0].content[0].text = title;
    await saveFile(id, name, contents);
  }
};
