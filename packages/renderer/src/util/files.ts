import { allFiles, refetchAllFiles, setFile } from "../state/file";
import { FilesList } from "../types";

const WORKSPACE_FILES = "files";

export async function saveFile(id: string, name: string, contents: any) {
  await window.saveFile(id, contents);
  if (![WORKSPACE_FILES, "user"].includes(id)) {
    await updateWorkspaceFiles(id, name);
  }
}

export async function getFileContents<T>(name: string): Promise<T> {
  let contents = await window.getFileContents(name);

  return contents;
}
export async function getAllFileNames(): Promise<FilesList[]> {
  let allFiles = await getFileContents<FilesList[]>(WORKSPACE_FILES);
  console.log("all files: ", allFiles);

  return allFiles;
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
  await saveFile(
    WORKSPACE_FILES,
    WORKSPACE_FILES,
    JSON.stringify(currentFiles)
  );
  refetchAllFiles();
}

export async function deleteFile(id: string) {
  let currentFiles = allFiles();
  let idx = currentFiles.findIndex((f) => f.id == id);
  if (idx != currentFiles.length - 1)
    currentFiles[idx + 1].index = currentFiles[idx].index;
  currentFiles.splice(idx, 1);
  await window.deleteNote(id);
  await saveFile(WORKSPACE_FILES, WORKSPACE_FILES, currentFiles);
  setFile({ id: "", name: "", contents: null });
  refetchAllFiles();
}

export async function renameFile(id: string, newName: string) {
  let updatedFiles = allFiles();
  let idx = updatedFiles.findIndex((f) => f.id == id);
  updatedFiles[idx].name = newName;
  await saveFile(WORKSPACE_FILES, WORKSPACE_FILES, updatedFiles);
  refetchAllFiles();
}
