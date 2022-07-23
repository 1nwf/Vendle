import { deleteNote, saveFile, getFileContents } from "./util";

export const handleSaveFile = async (
  event: any,
  id: string,
  contents: string
) => {
  return await saveFile(id, contents);
};

export const handleDeleteNote = async (event: any, id: string) => {
  return await deleteNote(id);
};

export const handleGetFileContents = async (event: any, name: string) => {
  return JSON.parse(await getFileContents(name));
};
