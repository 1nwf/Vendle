import { store } from "@/store";
import { WORKSPACE_FILES } from "@/util/files";
import { batch, createResource } from "solid-js";
import { createStore } from "solid-js/store";

const getFileNames = async () => {
  return await store.get(WORKSPACE_FILES);
};

export const [fileContents, setFileContents] = createStore({});
export const [file, setFile] = createStore({
  id: "",
  name: "",
  contents: {},
});
export const resetFileState = () => {
  batch(() => {
    setFile("contents", {});
    setFile("name", "");
    setFile("id", "");
  });
};
export const [allFiles, { mutate: setAllFiles, refetch: refetchAllFiles }] =
  createResource(getFileNames, {
    initialValue: [],
  });
