import { store } from "@/store";
import { createResource } from "solid-js";
import { createStore } from "solid-js/store";

const getFileNames = async () => {
  return await store.get("files");
};

export const [fileContents, setFileContents] = createStore({});
export const [file, setFile] = createStore({
  id: "",
  name: "",
  contents: {},
});
export const [allFiles, { refetch: refetchAllFiles }] = createResource(
  getFileNames,
  {
    initialValue: [],
  }
);
