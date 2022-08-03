import { allFiles, refetchAllFiles, setFile } from "../state/file";
import { FilesList } from "../types";
import { ipcRenderer } from "electron";
import { store } from "@/store";

export const handleFileSave = async (id: string, contents: string) => {
  return await ipcRenderer.invoke("saveFile", id, contents);
};
export const deleteNote = async (id: string) => {};
export const handleFileGetContents = async (name: string) => {
  return await ipcRenderer.invoke("getFileContents", name);
};

const WORKSPACE_FILES = "files";

export async function saveFile(id: string, name: string, contents: any) {
  await handleFileSave(id, JSON.stringify(contents));
  if (![WORKSPACE_FILES, "user"].includes(id)) {
    await updateWorkspaceFiles(id, name);
  }
}

export async function getFileContents<T>(name: string): Promise<T> {
  let contents = await handleFileGetContents(name);
  return contents;
}
export async function getAllFileNames(): Promise<FilesList[]> {
  let allFiles = await store.get(WORKSPACE_FILES);
  return allFiles ?? [];
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
  await store.set(WORKSPACE_FILES, currentFiles);
  refetchAllFiles();
}

export async function deleteFile(id: string) {
  let currentFiles = allFiles();
  let idx = currentFiles.findIndex((f) => f.id == id);
  if (idx != currentFiles.length - 1) {
    currentFiles[idx + 1].index = currentFiles[idx].index;
  }
  currentFiles.splice(idx, 1);
  await deleteNote(id);
  await store.set(WORKSPACE_FILES, currentFiles);
  setFile({ id: "", name: "", contents: {} });
  refetchAllFiles();
}

export async function renameFile(id: string, newName: string) {
  let updatedFiles = allFiles();
  let idx = updatedFiles.findIndex((f) => f.id == id);
  updatedFiles[idx].name = newName;
  await store.set(WORKSPACE_FILES, updatedFiles);
  refetchAllFiles();
}
